import * as dom from 'dts-dom';
import { Property } from 'jscodeshift';
import fs from 'fs';

function xdrUINT(ns) {
  const buffer = dom.create.interface('Buffer');
  const uintInterface = dom.create.interface('UINT');

  uintInterface.members.push(
    dom.create.property(
      'MAX_VALUE',
      dom.type.numberLiteral(4294967295),
      dom.DeclarationFlags.ReadOnly
    )
  );
  uintInterface.members.push(
    dom.create.property(
      'MIN_VALUE',
      dom.type.numberLiteral(0),
      dom.DeclarationFlags.ReadOnly
    )
  );
  uintInterface.members.push(
    dom.create.method(
      'read',
      [dom.create.parameter('io', buffer)],
      dom.type.number
    )
  );
  uintInterface.members.push(
    dom.create.method(
      'write',
      [
        dom.create.parameter('value', dom.type.number),
        dom.create.parameter('io', buffer)
      ],
      dom.type.void
    )
  );

  uintInterface.members.push(
    dom.create.method(
      'isValid',
      [dom.create.parameter('value', dom.type.number)],
      dom.type.boolean
    )
  );
  uintInterface.members.push(
    dom.create.method(
      'toXDR',
      [dom.create.parameter('value', dom.type.number)],
      buffer
    )
  );
  uintInterface.members.push(
    dom.create.method(
      'fromXDR',
      [
        dom.create.parameter('input', buffer),
        dom.create.parameter(
          'format',
          dom.type.stringLiteral('raw'),
          dom.ParameterFlags.Optional
        )
      ],
      dom.type.number
    )
  );
  uintInterface.members.push(
    dom.create.method(
      'fromXDR',
      [
        dom.create.parameter('input', dom.type.string),
        dom.create.parameter(
          'format',
          dom.create.union([
            dom.type.stringLiteral('hex'),
            dom.type.stringLiteral('base64')
          ])
        )
      ],
      dom.type.number
    )
  );

  return uintInterface;
}

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const types = j.types;
  const xdrDefs = j(file.source).findVariableDeclarators('types');

  const ns = dom.create.namespace('xdr');

  const uintInterface = xdrUINT(ns);
  ns.members.push(uintInterface);

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
