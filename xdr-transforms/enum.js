import * as dom from 'dts-dom';
import { Property } from 'jscodeshift';

export default function enumToTS(api, node, ns) {
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
          throw new Error('Uknown UnaryExpression: ' + p.value.value.operator);
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
