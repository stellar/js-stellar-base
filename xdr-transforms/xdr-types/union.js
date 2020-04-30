import { resolveType } from './utils';
import * as dom from 'dts-dom';

export default function union(api, node, ns, xdrTypes) {
  const [literal, arrayExp] = node.arguments;
  const name = literal.value;
  const union = dom.create.class(name);
  const attributes = [];
  const buffer = dom.create.interface('Buffer');

  ns.members.push(union);
}
