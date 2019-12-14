const assert = require('assert');
const fs = require('fs');
const path = require('path');
const globby = require('globby');
const { parse, print, builders: b  }  = require('ember-template-recast'); // eslint-disable-line
const { buildAST } = require('../lib/glimmer-hbs.js');

// NOTE: We are not testing the generated api directly here
// Instead we are checking whether the generated api can create 
// the right nodes or not.

describe('Glimmer builder api', function() {

  let fixtureDir = 'test/fixtures/glimmer';
  globby
    .sync('**/*.input.*', {
      cwd: fixtureDir,
    })
    .forEach(filename => {
      let extension = path.extname(filename);
      let testName = filename.replace(`.input${extension}`, '');
      let inputFixture = path.join(fixtureDir, `${testName}.input${extension}`);
      let outputFixture = path.join(fixtureDir, `${testName}.output${extension}`);

      it(testName, function() {

        const input = fs.readFileSync(inputFixture, 'utf-8');
        let ast = parse(input);

        let pseudoAst =  buildAST(ast);
        const sampleCode = '';
        const outputAst = parse(sampleCode);  

        // Check the manifested api is working fine
        pseudoAst.forEach(n => {
          // ember-template-recast goes into an infinite loop
          // hence we need to check we are not sending undefined
          n && outputAst.body.push(eval(n))
        });

        const code = print(outputAst, { quote: 'single'});
        const output = fs.readFileSync(outputFixture, 'utf-8');

        assert.strictEqual(code, output);

      });
    });
});
