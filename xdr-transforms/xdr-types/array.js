import * as dom from 'dts-dom';

/**
 * Builds a valid dts-dom node representing a XDR Array.
 *
 */
export default function array(ns) {
  const buffer = dom.create.interface('Buffer');
  const array = dom.create.class('XDRArray');
  const childType = dom.create.typeParameter('T');
  array.typeParameters.push(childType);

  array.members.push(
    dom.create.method('read', [dom.create.parameter('io', buffer)], buffer)
  );
  array.members.push(
    dom.create.method(
      'write',
      [
        dom.create.parameter('value', dom.create.array(childType)),
        dom.create.parameter('io', buffer)
      ],
      dom.type.void
    )
  );
  array.members.push(
    dom.create.method(
      'isValid',
      [dom.create.parameter('value', dom.create.array(childType))],
      dom.type.boolean
    )
  );
  // toXDR value is the same time as write value
  array.members.push(
    dom.create.method(
      'toXDR',
      [dom.create.parameter('value', dom.create.array(childType))],
      buffer
    )
  );
  array.members.push(
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
      dom.create.array(childType)
    )
  );
  array.members.push(
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
      dom.create.array(childType)
    )
  );

  return array;
}
