import * as dom from 'dts-dom';
import fs from 'fs';
import xdrInt from './xdr-types/integer';
import hyperToTS from './xdr-types/hyper';
import enumToTS from './xdr-types/enum';
import xdrString from './xdr-types/string';
import xdrOpaque from './xdr-types/opaque';
import xdrArray from './xdr-types/array';
import xdrOption from './xdr-types/option';
import typeDef from './xdr-types/type-def';
import structDef from './xdr-types/struct';
import unionDef from './xdr-types/union';

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

  const opaque = xdrOpaque(ns);
  ns.members.push(opaque);

  const varOpaque = dom.create.class('VarOpaque');
  varOpaque.baseType = opaque;
  ns.members.push(varOpaque);

  const option = xdrOption(ns);
  ns.members.push(option);

  const definitions = {
    INT: signedInt,
    UINT: unsignedInt,
    HYPER: hyper,
    UHYPER: uhyper,
    STRING: xString,
    OPAQUE: opaque,
    VAROPAQUE: varOpaque,
    ARRAY: array,
    OPTION: option,
    ns: ns
  };

  let logged = false;

  let config;

  xdrDefs.find(types.namedTypes.CallExpression).some((p) => {
    const node = p.value;
    const callee = node.callee;

    if (callee.type === 'MemberExpression') {
      if (
        callee.object.type === 'Identifier' &&
        callee.object.name === 'XDR' &&
        callee.property.name === 'config'
      ) {
        config = node.arguments[0].body.body; // extract all calls to xdr.
        return true;
      }
    }

    return false;
  });

  config.forEach(function(statement) {
    const node = statement.expression;
    const callee = node.callee;

    if (
      callee.type === 'MemberExpression' &&
      callee.object.name === 'xdr' &&
      callee.property.name === 'enum'
    ) {
      enumToTS(api, node.arguments, ns, types);
    }
  });

  // process typedefs first
  config.forEach(function(statement) {
    const node = statement.expression;
    const callee = node.callee;

    if (
      callee.type === 'MemberExpression' &&
      callee.object.name === 'xdr' &&
      callee.property.name === 'typedef'
    ) {
      typeDef(api, node, definitions);
    }
  });

  // process structs first
  config.forEach(function(statement) {
    const node = statement.expression;
    const callee = node.callee;

    if (
      callee.type === 'MemberExpression' &&
      callee.object.name === 'xdr' &&
      callee.property.name === 'struct'
    ) {
      structDef(api, node, definitions);
      typeDef(api, node, definitions);
    }
  });

  // process unions first
  config.forEach(function(statement) {
    const node = statement.expression;
    const callee = node.callee;

    if (
      callee.type === 'MemberExpression' &&
      callee.object.name === 'xdr' &&
      callee.property.name === 'union'
    ) {
      unionDef(api, node, definitions);
    }
  });

  // use this to output to a file instead of overriding source
  if (process.env.OUT) {
    console.log('writing to: ' + process.env.OUT);
    fs.writeFileSync(process.env.OUT, dom.emit(ns));
  } else {
    return dom.emit(ns);
  }
}
