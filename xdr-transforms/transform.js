import * as dom from 'dts-dom';
import fs from 'fs';
import hyperToTS from './xdr-types/hyper';
import enumToTS from './xdr-types/enum';
import typeDef from './xdr-types/type-def';
import structDef from './xdr-types/struct';
import unionDef from './xdr-types/union';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const types = j.types;
  const xdrDefs = j(file.source).findVariableDeclarators('types');

  const ns = dom.create.namespace('xdr');

  const hyper = hyperToTS(ns, 'Hyper');
  ns.members.push(hyper);
  const uhyper = hyperToTS(ns, 'UnsignedHyper');
  ns.members.push(uhyper);

  xdrDefs.find(types.namedTypes.CallExpression).forEach((p) => {
    const node = p.value;
    const callee = node.callee;

    if (callee.type === 'MemberExpression' && callee.object.name === 'xdr') {
      const xdrType = callee.property.name;

      switch (xdrType) {
        case 'enum':
          enumToTS(api, node.arguments, ns, types);
        case 'typedef':
          typeDef(api, node, ns);
          break;
        case 'struct':
          structDef(api, node, ns);
          break;
        case 'union':
          unionDef(api, node, ns);
          break;
        default:
          break;
      }
    }
  });

  // Use this to output to a file instead of overriding source
  if (process.env.OUT) {
    console.log('writing to: ' + process.env.OUT);
    fs.writeFileSync(process.env.OUT, dom.emit(ns));
  } else {
    return dom.emit(ns);
  }
}
