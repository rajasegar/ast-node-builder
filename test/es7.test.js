const assert = require('assert');
const fs = require('fs');
const { parse, print, types }  = require('recast');
const parser = require('@babel/parser')
const j = types.builders; // eslint-disable-line
const { buildAST } = require('../index.js');

// NOTE: We are not testing the generated api directly here
// Instead we are checking whether the generated api can create 
// the right nodes or not.

describe('ES7 builder api', function() {
  it.skip('should generate await expressions', function() {

    const fixturePath = 'test/fixtures/es7/awaitExpression';
    const inputFixture = `${fixturePath}.input.js`;
    const outputFixture = `${fixturePath}.output.js`;
    const input = fs.readFileSync(inputFixture, 'utf-8');
    debugger
    let ast = parser.parse(input, {
      sourceType: 'module',
    });

    let pseudoAst =  buildAST(ast);
    const sampleCode = '';
    const outputAst = parse(sampleCode);  

    // Check the manifested api is working fine
    pseudoAst.forEach(n => outputAst.program.body.push(eval(n)));

    const code = print(outputAst, { quote: 'single'}).code;
    const output = fs.readFileSync(outputFixture, 'utf-8');

    assert.strictEqual(code, output);

  });

});
