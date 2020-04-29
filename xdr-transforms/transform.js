import * as dom from 'dts-dom';
import fs from 'fs';
import xdrInt from './integer';
import enumToTS from './enum';
import hyperToTS from './hyper';

function isXDRMemberCall(node) {
  return node.type === 'MemberExpression' && node.object.name === 'xdr';
}

function isXDRIntOrUint(node) {
  return (
    node.type === 'Identifier' && (node.name === 'uint' || node.name === 'int')
  );
}

function typeDef(api, node, ns, xdrTypes) {
  const [literal, exp] = node.arguments;
  const name = literal.value;

  if (exp.type === 'CallExpression') {
    if (isXDRMemberCall(exp.callee)) {
      if (isXDRIntOrUint(exp.callee.property)) {
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

  const long = dom.create.importAll('Long', 'long');
  ns.members.push(long);

  const signedInt = xdrInt(
    ns,
    'SignedInteger',
    Math.pow(2, 31) - 1,
    -Math.pow(2, 31)
  );
  const unsignedInt = xdrInt(ns, 'UnsignedInteger', Math.pow(2, 32) - 1, 0);
  ns.members.push(signedInt);
  ns.members.push(unsignedInt);

  const hyper = hyperToTS(ns, 'Hyper');
  ns.members.push(hyper);

  const xdrTypes = {
    INT: signedInt,
    UINT: unsignedInt,
    HYPER: hyper
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
