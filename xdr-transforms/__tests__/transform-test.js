import { runSnapshotTest } from 'jscodeshift/dist/testUtils';
import transform from '../transform';
import path from 'path';
import fs from 'fs';

jest.autoMockOff();

test.each([
  ['xdr enum', 'enum.js', {}],
  ['type definitions', 'typedef.js', {}],
  ['xdr structs', 'struct.js', {}],
  ['xdr unions', 'union.js', {}]
])('.transform(%s)', (desc, source, opts) => {
  const fixtures = path.join(__dirname, '..', '__testfixtures__');
  const content = fs.readFileSync(path.join(fixtures, source)).toString();

  runSnapshotTest(transform, opts, {
    source: content
  });
});
