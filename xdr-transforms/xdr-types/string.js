import * as dom from 'dts-dom';

/**
 * Builds a valid dts-dom node representing a XDR String.
 *
 */
export default function string(ns) {
  const buffer = dom.create.interface('Buffer');
  const xdrString = dom.create.class('XDRString');

  xdrString.members.push(
    dom.create.constructor([
      dom.create.parameter(
        'maxLength',
        dom.type.numberLiteral(Math.pow(2, 32) - 1)
      )
    ])
  );

  xdrString.members.push(
    dom.create.method('read', [dom.create.parameter('io', buffer)], buffer)
  );
  xdrString.members.push(
    dom.create.method(
      'readString',
      [dom.create.parameter('io', buffer)],
      dom.type.string
    )
  );
  xdrString.members.push(
    dom.create.method(
      'write',
      [
        dom.create.parameter(
          'value',
          dom.create.union([dom.type.string, buffer])
        ),
        dom.create.parameter('io', buffer)
      ],
      dom.type.void
    )
  );
  xdrString.members.push(
    dom.create.method(
      'isValid',
      [
        dom.create.parameter(
          'value',
          dom.create.union([
            dom.type.string,
            dom.type.array(dom.type.number),
            buffer
          ])
        )
      ],
      dom.type.boolean
    )
  );
  xdrString.members.push(
    dom.create.method(
      'toXDR',
      [
        dom.create.parameter(
          'value',
          dom.create.union([dom.type.string, buffer])
        )
      ],
      buffer
    )
  );
  xdrString.members.push(
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
  xdrString.members.push(
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

  return xdrString;
}
