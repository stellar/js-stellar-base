import { resolveType } from './utils';
import * as dom from 'dts-dom';

export default function structDef(api, node, ns) {
  const [literal, arrayExp] = node.arguments;
  const name = literal.value;
  const struct = dom.create.class(name);
  const attributes = [];
  const buffer = dom.create.interface('Buffer');

  arrayExp.elements.forEach(({ elements: [attr, type] }) => {
    const xdrType = resolveType(api, type);
    attributes.push(dom.create.property(attr.value, xdrType));
    struct.members.push(
      dom.create.method(
        attr.value,
        [dom.create.parameter('value', xdrType, dom.ParameterFlags.Optional)],
        xdrType
      )
    );
  });
  struct.members.unshift(
    dom.create.constructor([
      dom.create.parameter('attributes', dom.create.objectType(attributes))
    ])
  );
  struct.members.push(
    dom.create.method(
      'toXDR',
      [
        dom.create.parameter(
          'format',
          dom.type.stringLiteral('raw'),
          dom.ParameterFlags.Optional
        )
      ],
      buffer
    )
  );
  struct.members.push(
    dom.create.method(
      'toXDR',
      [
        dom.create.parameter(
          'format',
          dom.create.union([
            dom.type.stringLiteral('hex'),
            dom.type.stringLiteral('base64')
          ])
        )
      ],
      dom.type.string
    )
  );
  struct.members.push(
    dom.create.method(
      'read',
      [dom.create.parameter('io', buffer)],
      struct,
      dom.DeclarationFlags.Static
    )
  );
  struct.members.push(
    dom.create.method(
      'write',
      [
        dom.create.parameter('value', struct),
        dom.create.parameter('io', buffer)
      ],
      dom.type.void,
      dom.DeclarationFlags.Static
    )
  );
  struct.members.push(
    dom.create.method(
      'isValid',
      [dom.create.parameter('value', struct)],
      dom.type.boolean,
      dom.DeclarationFlags.Static
    )
  );
  struct.members.push(
    dom.create.method(
      'toXDR',
      [dom.create.parameter('value', struct)],
      buffer,
      dom.DeclarationFlags.Static
    )
  );
  struct.members.push(
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
      struct,
      dom.DeclarationFlags.Static
    )
  );
  struct.members.push(
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
      struct,
      dom.DeclarationFlags.Static
    )
  );

  ns.members.push(struct);
}
