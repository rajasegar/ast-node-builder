import assert from 'assert';
import fs from 'fs';
import path from 'path';
import globby from 'globby';

import { parse, print, types }  from 'recast';
import  { buildAST } from '../index.js';

const j = types.builders; // eslint-disable-line

// NOTE: We are not testing the generated api directly here
// Instead we are checking whether the generated api can create 
// the right nodes or not.

describe('Core builder api', function() {
  let fixtureDir = 'test/fixtures/core';
  globby
    .sync('**/*.input.*', {
      cwd: fixtureDir,
    })
    .forEach(filename => {
      let extension = path.extname(filename);
      let testName = filename.replace(`.input${extension}`, '');
      let inputFixture = path.join(fixtureDir, `${testName}.input${extension}`);
      let outputFixture = path.join(fixtureDir, `${testName}.output${extension}`);

      test(testName, function() {

        const input = fs.readFileSync(inputFixture, 'utf-8');
        let ast = parse(input);

        let pseudoAst =  buildAST(ast);
        const sampleCode = '';
        const outputAst = parse(sampleCode);  

         //Check the manifested api is working fine
        pseudoAst.forEach(n => outputAst.program.body.push(eval(n)));

        const code = print(outputAst, { quote: 'single'}).code;
        const output = fs.readFileSync(outputFixture, 'utf-8');

        assert.strictEqual(code, output);
      });
    });

});

