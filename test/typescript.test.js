const assert = require('assert');
const fs = require('fs');
const path = require('path');
const globby = require('globby');
const ts = require('typescript');
const { parse, print, types }  = require('recast');
const j = types.builders; // eslint-disable-line
const { buildAST } = require('../lib/typescript.js');

// NOTE: We are not testing the generated api directly here
// Instead we are checking whether the generated api can create 
// the right nodes or not.

/**
 * Parse with Typescript
 */
function parseWithTypescript(source) {
  return parse(source, {
      parser: require('recast/parsers/typescript')
    });
}
describe('Typescript builder api', function() {

  let fixtureDir = 'test/fixtures/typescript';
  globby
    .sync('**/*.input.*', {
      cwd: fixtureDir,
    })
    .forEach(filename => {
      let extension = path.extname(filename);
      let testName = filename.replace(`.input${extension}`, '');
      let inputFixture = path.join(fixtureDir, `${testName}.input${extension}`);
      let outputFixture = path.join(fixtureDir, `${testName}.output${extension}`);

      it.skip(testName, function() {

        const input = fs.readFileSync(inputFixture, 'utf-8');
   
        let ast = parseWithTypescript(input);
        //console.log(ast.program.body);

        let pseudoAst =  buildAST(ast);
        const sampleCode = '';
        const outputAst = parseWithTypescript(sampleCode);  
        console.log(outputAst);

        // Check the manifested api is working fine
        pseudoAst.forEach(n => {
          n && outputAst.program.body.push(eval(n))
        });

        const code = print(outputAst, { quote: 'single'}).code;
        const output = fs.readFileSync(outputFixture, 'utf-8');

        assert.strictEqual(code, output);

      });
    });
  
});
