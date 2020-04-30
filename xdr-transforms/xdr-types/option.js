import * as dom from 'dts-dom';

/**
 * Builds a valid dts-dom node representing a XDR Option.
 *
 */
export default function option(ns) {
  const buffer = dom.create.interface('Buffer');
  const option = dom.create.class('Option');

  option.members.push(
    dom.create.constructor([
      dom.create.parameter(
        'childType',
        dom.create.objectType([
          dom.create.method(
            'read',
            [dom.create.parameter('io', dom.type.any)],
            dom.type.any
          ),
          dom.create.method(
            'write',
            [
              dom.create.parameter('value', dom.type.any),
              dom.create.parameter('io', buffer)
            ],
            dom.type.void
          ),
          dom.create.method(
            'isValid',
            [dom.create.parameter('value', dom.type.any)],
            dom.type.boolean
          )
        ])
      )
    ])
  );
  option.members.push(
    dom.create.method(
      'read',
      [dom.create.parameter('io', buffer)],
      dom.type.any
    )
  );
  option.members.push(
    dom.create.method(
      'write',
      [
        dom.create.parameter('value', dom.type.any),
        dom.create.parameter('io', buffer)
      ],
      dom.type.void
    )
  );
  option.members.push(
    dom.create.method(
      'isValid',
      [dom.create.parameter('value', dom.type.any)],
      dom.type.boolean
    )
  );
  // toXDR value is the same time as write value
  option.members.push(
    dom.create.method(
      'toXDR',
      [dom.create.parameter('value', dom.type.any)],
      buffer
    )
  );
  option.members.push(
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
      dom.type.any
    )
  );
  option.members.push(
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
      dom.type.any
    )
  );

  return option;
}
