import * as dom from 'dts-dom';

export default function ioMixin(node, toXDRParam, includeInstanceMethods) {
  const buffer = dom.create.interface('Buffer');
  if (includeInstanceMethods) {
    node.members.push(
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
    node.members.push(
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
  }
  node.members.push(
    dom.create.method(
      'toXDR',
      [dom.create.parameter('value', toXDRParam)],
      buffer,
      dom.DeclarationFlags.Static
    )
  );
  node.members.push(
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
      node,
      dom.DeclarationFlags.Static
    )
  );
  node.members.push(
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
      node,
      dom.DeclarationFlags.Static
    )
  );
}
