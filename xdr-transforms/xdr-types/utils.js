import * as dom from 'dts-dom';

export function isXDRMemberCall(node) {
  return node.type === 'MemberExpression' && node.object.name === 'xdr';
}

export function isNativeXDRType(node) {
  const nativeTypes = [
    'int',
    'uint',
    'hyper',
    'uhyper',
    'string',
    'opaque',
    'varOpaque',
    'array',
    'varArray',
    'lookup',
    'option',
    'void'
  ];

  return node.type === 'Identifier' && nativeTypes.indexOf(node.name) >= 0;
}

export function resolveType(api, node) {
  if (node.type !== 'CallExpression') {
    throw New(
      `Invalid type, expected a CallExpression but received a ${node.type}`
    );
  }
  const buffer = dom.create.interface('Buffer');

  if (isNativeXDRType(node.callee.property)) {
    switch (node.callee.property.name) {
      case 'int':
        return dom.type.number;
        break;
      case 'uint':
        return dom.type.number;
        break;
      case 'hyper':
        return dom.create.namedTypeReference('Hyper');
        break;
      case 'uhyper':
        return dom.create.namedTypeReference('UnsignedHyper');
        break;
      case 'string':
        return dom.create.union([dom.type.string, buffer]);
        break;
      case 'opaque':
        return buffer;
        break;
      case 'varOpaque':
        return buffer;
        break;
      case 'array':
        return dom.create.array(resolveType(api, node.arguments[0]));
        break;
      case 'varArray':
        return dom.create.array(resolveType(api, node.arguments[0]));
        break;
      case 'lookup':
        if (node.arguments[0].type !== 'Literal') {
          throw new Error(
            'Invalid argument pass to lookup, expected a Literal'
          );
        }
        return dom.create.namedTypeReference(node.arguments[0].value);
        break;
      case 'option':
        return dom.create.union([
          dom.type.null,
          resolveType(api, node.arguments[0])
        ]);
        break;
      case 'void':
        return dom.type.void;
        break;
      default:
        throw new Error(`Unknown type: ${node.callee.property.name}`);
        break;
    }
  }
}
