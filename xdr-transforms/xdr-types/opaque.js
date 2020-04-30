import * as dom from 'dts-dom';

/**
 * Builds a valid dts-dom node representing a XDR Opaque.
 *
 */
export default function string(ns) {
  const buffer = dom.create.interface('Buffer');
  const opaque = dom.create.class('Opaque');

  opaque.members.push(
    dom.create.constructor([dom.create.parameter('length', dom.type.number)])
  );

  opaque.members.push(
    dom.create.method('read', [dom.create.parameter('io', buffer)], buffer)
  );
  opaque.members.push(
    dom.create.method(
      'write',
      [
        dom.create.parameter('value', buffer),
        dom.create.parameter('io', buffer)
      ],
      dom.type.void
    )
  );
  opaque.members.push(
    dom.create.method(
      'isValid',
      [dom.create.parameter('value', buffer)],
      dom.type.boolean
    )
  );
  opaque.members.push(
    dom.create.method('toXDR', [dom.create.parameter('value', buffer)], buffer)
  );
  opaque.members.push(
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
      buffer
    )
  );
  opaque.members.push(
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
      buffer
    )
  );

  return opaque;
}
