const assert = require('assert');
const fs = require('fs');
const { parse, print, types }  = require('recast');
const j = types.builders; // eslint-disable-line
const {
  arrowFunctionExpression,
  classDeclaration,
  exportDefaultDeclaration,
  expressionStatement,
  functionDeclaration,
  ifStatement,
  importDeclaration,
  variableDeclaration,
  buildAST,
  callExpression,
  literal,
  identifier,
  memberExpression
} = require('../index.js');


describe('Core builder api', function() {
  it('should generate a class declaration', function() {

    const input = fs.readFileSync('test/fixtures/classDeclaration.input.js', 'utf-8');
    let ast = parse(input);

    let pseudoAst =  buildAST(ast);
    const sampleCode = '';
    const outputAst = parse(sampleCode);  

    // Check the manifested api is working fine
    pseudoAst.forEach(n => outputAst.program.body.push(eval(n)));

    const code = print(outputAst, { quote: 'single'}).code;
    const output = fs.readFileSync('test/fixtures/classDeclaration.output.js', 'utf-8');

    assert.strictEqual(code, output);

  });

  it('should generate an Arrow Function Expression', function() {

    const input = fs.readFileSync('test/fixtures/arrowFunctionExpression.input.js', 'utf-8');
    let ast = parse(input);

    let pseudoAst =  buildAST(ast);
    const sampleCode = '';
    const outputAst = parse(sampleCode);  

    // Check the manifested api is working fine
    pseudoAst.forEach(n => outputAst.program.body.push(eval(n)));

    const code = print(outputAst, { quote: 'single'}).code;
    const output = fs.readFileSync('test/fixtures/arrowFunctionExpression.output.js', 'utf-8');

    assert.strictEqual(code, output);

  });

  it('should generate a switch case statement', function() {

    const input = fs.readFileSync('test/fixtures/switch.input.js', 'utf-8');
    let ast = parse(input);

    let pseudoAst =  buildAST(ast);
    const sampleCode = '';
    const outputAst = parse(sampleCode);  

    // Check the manifested api is working fine
    pseudoAst.forEach(n => outputAst.program.body.push(eval(n)));

    const code = print(outputAst, { quote: 'single'}).code;
    const output = fs.readFileSync('test/fixtures/switch.output.js', 'utf-8');

    assert.strictEqual(code, output);

  });
});
