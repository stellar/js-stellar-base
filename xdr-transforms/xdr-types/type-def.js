import * as dom from 'dts-dom';
import { isXDRMemberCall, isNativeXDRType, resolveType } from './utils';

export default function typeDef(api, node, definitions) {
  const ns = definitions.ns;
  const [literal, exp] = node.arguments;
  const name = literal.value;
  const buffer = dom.create.interface('Buffer');

  if (exp.type === 'CallExpression') {
    switch (exp.callee.property.name) {
      case 'int':
        ns.members.push(
          dom.create.const(name, definitions.INT, dom.DeclarationFlags.ReadOnly)
        );
        break;
      case 'uint':
        ns.members.push(
          dom.create.const(
            name,
            definitions.UINT,
            dom.DeclarationFlags.ReadOnly
          )
        );
        break;
      case 'hyper':
        const hyper = dom.create.class(name);
        hyper.baseType = dom.create.namedTypeReference('Hyper');
        ns.members.push(hyper);
        break;
      case 'uhyper':
        const uhyper = dom.create.class(name);
        uhyper.baseType = dom.create.namedTypeReference('UnsignedHyper');
        ns.members.push(uhyper);
        break;
      case 'string':
        ns.members.push(
          dom.create.const(
            name,
            definitions.STRING,
            dom.DeclarationFlags.ReadOnly
          )
        );
        break;
      case 'opaque':
        ns.members.push(
          dom.create.const(
            name,
            definitions.OPAQUE,
            dom.DeclarationFlags.ReadOnly
          )
        );
        break;
      case 'varOpaque':
        ns.members.push(
          dom.create.const(
            name,
            definitions.VAROPAQUE,
            dom.DeclarationFlags.ReadOnly
          )
        );
        break;
      case 'array':
        const xdrArray = dom.create.const(
          name,
          definitions.ARRAY,
          dom.DeclarationFlags.ReadOnly
        );
        // this is hack to resolve the final value when using this type as an argument
        xdrArray._childType = resolveType(api, exp.arguments[0], definitions);
        ns.members.push(xdrArray);
        break;
      case 'varArray':
        const varArray = dom.create.const(
          name,
          definitions.VARARRAY,
          dom.DeclarationFlags.ReadOnly
        );
        // this is hack to resolve the final value when using this type as an argument
        varArray._childType = resolveType(api, exp.arguments[0], definitions);
        ns.members.push(varArray);
        break;
      case 'lookup':
        if (exp.arguments[0].type !== 'Literal') {
          throw new Error(
            'Invalid argument pass to lookup, expected a Literal'
          );
        }
        ns.members.push(
          dom.create.alias(
            name,
            dom.create.namedTypeReference(exp.arguments[0].value)
          )
        );
        break;
      case 'option':
        ns.members.push(
          dom.create.alias(
            name,
            dom.create.union([
              dom.type.undefined,
              resolveType(api, exp.arguments[0], definitions)
            ])
          )
        );
        break;
      default:
        throw new Error(`Unknown type: ${exp.callee.property.name}`);
        break;
    }
  }
}
