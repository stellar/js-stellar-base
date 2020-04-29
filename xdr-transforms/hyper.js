import * as dom from 'dts-dom';
import ioMixin from './io-mixin';

/**
 * Builds a valid dts-dom node representing a signed or unsigned XDR
 * Hyper.
 *
 */
export default function hyper(ns, name) {
  const buffer = dom.create.interface('Buffer');
  const hyper = dom.create.class(name);
  hyper.members.push(
    dom.create.constructor([
      dom.create.parameter('low', dom.type.number),
      dom.create.parameter('high', dom.type.number)
    ])
  );

  ioMixin(hyper, hyper, true);
  hyper.members.push(
    dom.create.property('MAX_VALUE', hyper, dom.DeclarationFlags.ReadOnly)
  );
  hyper.members.push(
    dom.create.property('MIN_VALUE', hyper, dom.DeclarationFlags.ReadOnly)
  );
  hyper.members.push(
    dom.create.method(
      'read',
      [dom.create.parameter('io', buffer)],
      hyper,
      dom.DeclarationFlags.Static
    )
  );
  hyper.members.push(
    dom.create.method(
      'write',
      [
        dom.create.parameter('value', hyper),
        dom.create.parameter('io', buffer)
      ],
      dom.type.void,
      dom.DeclarationFlags.Static
    )
  );
  hyper.members.push(
    dom.create.method(
      'fromString',
      [dom.create.parameter('input', dom.type.string)],
      hyper,
      dom.DeclarationFlags.Static
    )
  );
  hyper.members.push(
    dom.create.method(
      'fromBytes',
      [
        dom.create.parameter('low', dom.type.number),
        dom.create.parameter('high', dom.type.number)
      ],
      hyper,
      dom.DeclarationFlags.Static
    )
  );
  hyper.members.push(
    dom.create.method(
      'isValid',
      [dom.create.parameter('value', hyper)],
      dom.type.boolean,
      dom.DeclarationFlags.Static
    )
  );

  return hyper;
}
