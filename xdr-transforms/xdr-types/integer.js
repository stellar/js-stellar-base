import * as dom from 'dts-dom';

/**
 * Builds a valid dts-dom node representing a signed or unsigned XDR
 * Int.
 *
 */
export default function unsignedInteger(
  ns,
  name,
  maxValue = Math.pow(2, 31) - 1,
  minValue = -Math.pow(2, 31)
) {
  const buffer = dom.create.interface('Buffer');
  const uintInterface = dom.create.interface(name);

  uintInterface.members.push(
    dom.create.property(
      'MAX_VALUE',
      dom.type.numberLiteral(maxValue),
      dom.DeclarationFlags.ReadOnly
    )
  );
  uintInterface.members.push(
    dom.create.property(
      'MIN_VALUE',
      dom.type.numberLiteral(minValue),
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
