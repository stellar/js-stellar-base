import * as dom from 'dts-dom';
import { Property } from 'jscodeshift';
import fs from 'fs';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const types = j.types;
  const xdrDefs = j(file.source).findVariableDeclarators('types');

  const ns = dom.create.namespace('xdr');

  xdrDefs.find(types.namedTypes.CallExpression).forEach((p) => {
    const node = p.value;
    const callee = node.callee;

    if (callee.type === 'MemberExpression' && callee.object.name === 'xdr') {
      const xdrType = callee.property.name;

      if (xdrType === 'enum') {
        enumToTS(node.arguments, ns, types);
      }
    }
  });

  fs.writeFileSync('./out.ts', dom.emit(ns));

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
        values.push(dom.type.numberLiteral(p.value.value.value));
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
