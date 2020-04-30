import * as dom from 'dts-dom';
import fs from 'fs';
import xdrInt from './xdr-types/integer';
import hyperToTS from './xdr-types/hyper';
import enumToTS from './xdr-types/enum';
import xdrString from './xdr-types/string';
import xdrOpaque from './xdr-types/opaque';
import xdrArray from './xdr-types/array';

function isXDRMemberCall(node) {
  return node.type === 'MemberExpression' && node.object.name === 'xdr';
}

function isNativeXDRType(node) {
  const nativeTypes = [
    'int',
    'uint',
    'hyper',
    'uhyper',
    'string',
    'opaque',
    'varOpaque',
    'array',
    'varArray',
    'lookup'
  ];

  return node.type === 'Identifier' && nativeTypes.indexOf(node.name) >= 0;
}

function typeDef(api, node, ns, xdrTypes) {
  const [literal, exp] = node.arguments;
  const name = literal.value;

  if (exp.type === 'CallExpression') {
    if (isXDRMemberCall(exp.callee)) {
      if (isNativeXDRType(exp.callee.property)) {
        switch (exp.callee.property.name) {
          case 'int':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.INT,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'uint':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.UINT,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'hyper':
            const hyper = dom.create.class(name);
            hyper.baseType = xdrTypes.HYPER;
            ns.members.push(hyper);
            break;
          case 'uhyper':
            const uhyper = dom.create.class(name);
            uhyper.baseType = xdrTypes.UHYPER;
            ns.members.push(uhyper);
            break;
          case 'string':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.STRING,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'opaque':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.OPAQUE,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'varOpaque':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.VAROPAQUE,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'array':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.ARRAY,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'varArray':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.VARARRAY,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'lookup':
            if (exp.arguments[0].type !== 'Literal') {
              throw new Error(
                'Invalid argument pass to lookup, expected a Literal'
              );
            }
            ns.members.push(
              dom.create.const(
                name,
                dom.create.typeof(
                  dom.create.namedTypeReference(exp.arguments[0].value)
                ),
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
        }
      }
    }
  }
}

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const types = j.types;
  const xdrDefs = j(file.source).findVariableDeclarators('types');

  const ns = dom.create.namespace('xdr');

  const signedInt = xdrInt(
    ns,
    'SignedInt',
    Math.pow(2, 31) - 1,
    -Math.pow(2, 31)
  );
  const unsignedInt = xdrInt(ns, 'UnsignedInt', Math.pow(2, 32) - 1, 0);
  ns.members.push(signedInt);
  ns.members.push(unsignedInt);

  const hyper = hyperToTS(ns, 'Hyper');
  ns.members.push(hyper);
  const uhyper = hyperToTS(ns, 'UnsignedHyper');
  ns.members.push(uhyper);

  const xString = xdrString(ns);
  ns.members.push(xString);

  const array = xdrArray(ns);
  ns.members.push(array);

  const varArray = dom.create.class('VarArray');
  varArray.baseType = array;
  ns.members.push(varArray);

  const opaque = xdrOpaque(ns);
  ns.members.push(opaque);

  const varOpaque = dom.create.class('VarOpaque');
  varOpaque.baseType = opaque;
  ns.members.push(varOpaque);

  const xdrTypes = {
    INT: signedInt,
    UINT: unsignedInt,
    HYPER: hyper,
    UHYPER: uhyper,
    STRING: xString,
    OPAQUE: opaque,
    VAROPAQUE: varOpaque,
    ARRAY: array,
    VARARRAY: varArray
  };

  xdrDefs.find(types.namedTypes.CallExpression).forEach((p) => {
    const node = p.value;
    const callee = node.callee;

    if (callee.type === 'MemberExpression' && callee.object.name === 'xdr') {
      const xdrType = callee.property.name;

      switch (xdrType) {
        case 'enum':
          enumToTS(api, node.arguments, ns, types);
        case 'typedef':
          typeDef(api, node, ns, xdrTypes);
        default:
          break;
      }
    }
  });

  // Use this to output to a file instead of overriding source
  if (process.env.OUT) {
    console.log('writing to: ' + process.env.OUT);
    fs.writeFileSync(process.env.OUT, dom.emit(ns));
  } else {
    return dom.emit(ns);
  }
}
