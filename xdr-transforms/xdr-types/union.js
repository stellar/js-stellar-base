import { resolveType } from './utils';
import * as dom from 'dts-dom';

export default function union(api, node, typeDefs) {
  const ns = typeDefs.ns;
  const [literal, objExp] = node.arguments;
  const name = literal.value;
  const union = dom.create.class(name);
  const attributes = [];
  const buffer = dom.create.interface('Buffer');
  let switches;
  let arms = {};

  objExp.properties.forEach((property) => {
    let xdrType;
    let types = [];
    switch (property.key.name) {
      case 'switchOn':
        xdrType = resolveType(api, property.value, typeDefs);
        union.members.push(dom.create.method('switch', [], xdrType));
        break;
      case 'arms':
        property.value.properties.forEach((p) => {
          xdrType = resolveType(api, p.value, typeDefs);
          types.push(xdrType);
          union.members.push(
            dom.create.method(
              p.key.name,
              [
                dom.create.parameter(
                  'value',
                  xdrType,
                  dom.ParameterFlags.Optional
                )
              ],
              xdrType
            )
          );
          arms[p.key.name] = xdrType;
        });
        if (types.length > 0) {
          // skip if there are no values, void union
          // TODO: how is this handled in js-xdr?
          union.members.push(
            dom.create.method('value', [], dom.create.union(types))
          );
        }

        break;
      case 'switches':
        switches = property;
        break;
    }
  });

  switches.value.elements.forEach((p) => {
    // Only define the method if the type exist
    // TODO: figure how to handle void
    if (arms[p.elements[1].value]) {
      union.members.push(
        dom.create.method(
          p.elements[0].value,
          [dom.create.parameter('value', arms[p.elements[1].value])],
          union,
          dom.DeclarationFlags.Static
        )
      );
    }
  });

  union.members.push(
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
  union.members.push(
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
  union.members.push(
    dom.create.method(
      'read',
      [dom.create.parameter('io', buffer)],
      union,
      dom.DeclarationFlags.Static
    )
  );
  union.members.push(
    dom.create.method(
      'write',
      [
        dom.create.parameter('value', union),
        dom.create.parameter('io', buffer)
      ],
      dom.type.void,
      dom.DeclarationFlags.Static
    )
  );
  union.members.push(
    dom.create.method(
      'isValid',
      [dom.create.parameter('value', union)],
      dom.type.boolean,
      dom.DeclarationFlags.Static
    )
  );
  union.members.push(
    dom.create.method(
      'toXDR',
      [dom.create.parameter('value', union)],
      buffer,
      dom.DeclarationFlags.Static
    )
  );
  union.members.push(
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
      union,
      dom.DeclarationFlags.Static
    )
  );
  union.members.push(
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
      union,
      dom.DeclarationFlags.Static
    )
  );

  ns.members.push(union);
}
