import * as dom from 'dts-dom';
import { isXDRMemberCall, isNativeXDRType } from './utils';

export default function typeDef(api, node, ns, xdrTypes) {
  const [literal, exp] = node.arguments;
  const name = literal.value;

  if (exp.type === 'CallExpression') {
    if (isXDRMemberCall(exp.callee)) {
      if (isNativeXDRType(exp.callee.property)) {
        switch (exp.callee.property.name) {
          case 'int':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.INT,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'uint':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.UINT,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'hyper':
            const hyper = dom.create.class(name);
            hyper.baseType = xdrTypes.HYPER;
            ns.members.push(hyper);
            break;
          case 'uhyper':
            const uhyper = dom.create.class(name);
            uhyper.baseType = xdrTypes.UHYPER;
            ns.members.push(uhyper);
            break;
          case 'string':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.STRING,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'opaque':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.OPAQUE,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'varOpaque':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.VAROPAQUE,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'array':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.ARRAY,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'varArray':
            ns.members.push(
              dom.create.const(
                name,
                xdrTypes.VARARRAY,
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
          case 'lookup':
            if (exp.arguments[0].type !== 'Literal') {
              throw new Error(
                'Invalid argument pass to lookup, expected a Literal'
              );
            }
            ns.members.push(
              dom.create.const(
                name,
                dom.create.typeof(
                  dom.create.namedTypeReference(exp.arguments[0].value)
                ),
                dom.DeclarationFlags.ReadOnly
              )
            );
            break;
        }
      }
    }
  }
}
