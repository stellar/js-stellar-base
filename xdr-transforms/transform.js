import * as dom from 'dts-dom';
import { Property } from 'jscodeshift';
import fs from 'fs';
import xdrInt from './unsigned-integer';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const types = j.types;
  const xdrDefs = j(file.source).findVariableDeclarators('types');

  const ns = dom.create.namespace('xdr');

  const signedInt = xdrInt(ns, 'INT', Math.pow(2, 31) - 1, -Math.pow(2, 31));
  const unsignedInt = xdrInt(ns, 'UINT', Math.pow(2, 32) - 1, 0);

  ns.members.push(signedInt);
  ns.members.push(unsignedInt);

  xdrDefs.find(types.namedTypes.CallExpression).forEach((p) => {
    const node = p.value;
    const callee = node.callee;

    if (callee.type === 'MemberExpression' && callee.object.name === 'xdr') {
      const xdrType = callee.property.name;

      switch (xdrType) {
        case 'enum':
          enumToTS(node.arguments, ns, types);
        case 'typedef':
        // console.log(node);
        default:
          break;
      }
    }
  });

  const source = dom.emit(ns);
  fs.writeFileSync('./out.d.ts', source);

  function enumToTS(node, ns) {
    const [literal, objExp] = node;
    const union = dom.create.class(literal.value);
    const identifiers = [];
    const values = [];

    api
      .jscodeshift(objExp)
      .find(Property)
      .forEach((p) => {
        identifiers.push(dom.type.stringLiteral(p.value.key.name));
        if (p.value.value.type === 'Literal') {
          values.push(dom.type.numberLiteral(p.value.value.value));
        } else if (p.value.value.type === 'UnaryExpression') {
          if (p.value.value.prefix && p.value.value.operator === '-') {
            values.push(dom.type.numberLiteral(-p.value.value.argument.value));
          } else {
            throw new Error(
              'Uknown UnaryExpression: ' + p.value.value.operator
            );
          }
        } else {
          throw new Error('Uknown type: ' + p.value.value.type);
        }
      });

    union.members.push(
      dom.create.property(
        'name',
        dom.create.union(identifiers),
        dom.DeclarationFlags.ReadOnly
      )
    );
    union.members.push(
      dom.create.property(
        'value',
        dom.create.union(values),
        dom.DeclarationFlags.ReadOnly
      )
    );

    identifiers.forEach((i) => {
      union.members.push(
        dom.create.method(i.value, [], union, dom.DeclarationFlags.Static)
      );
    });

    ns.members.push(union);
  }
}
