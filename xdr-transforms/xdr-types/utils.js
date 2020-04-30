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
    'lookup'
  ];

  return node.type === 'Identifier' && nativeTypes.indexOf(node.name) >= 0;
}

export function resolveType(api, node, xdrTypes) {
  if (node.type !== 'CallExpression') {
    throw New(
      `Invalid type, expected a CallExpression but received a ${node.type}`
    );
  }

  if (isXDRMemberCall(node.callee)) {
    if (isNativeXDRType(node.callee.property)) {
      switch (node.callee.property.name) {
        case 'int':
          return xdrTypes.INT;
          break;
        case 'uint':
          return xdrTypes.UINT;
          break;
        case 'hyper':
          return xdrTypes.HYPER;
          break;
        case 'uhyper':
          return xdrTypes.UHYPER;
          break;
        case 'string':
          return xdrTypes.STRING;
          break;
        case 'opaque':
          return xdrTypes.OPAQUE;
          break;
        case 'varOpaque':
          return xdrTypes.VAROPAQUE;
          break;
        case 'array':
          return xdrTypes.ARRAY;
          break;
        case 'varArray':
          return xdrTypes.VARARRAY;
          break;
        case 'lookup':
          if (node.arguments[0].type !== 'Literal') {
            throw new Error(
              'Invalid argument pass to lookup, expected a Literal'
            );
          }
          return dom.create.typeof(
            dom.create.namedTypeReference(node.arguments[0].value)
          );
          break;
      }
    }
  }
}
