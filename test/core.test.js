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


const _code1 = `
hello(1, 'world', true, a);
this.hello(1, 'world', true, a);
hello.world(1, 'foo', true, a);
foo.bar.baz();
foo.bar.bax.baz(1, 'foo', true, a);
if(a === 1) {
console.log('true');
foo.bar();
} else {
console.log('false');
foo.baz();
}

let a = {
name: 'raja',
age: 35,
action: hello()
};

export default class MyComponent extends ReactComponent {}
class MyComponent extends ReactComponent {
  constructor(a,b) {
    this.a = a;
    this.b = b;
  }

  hello(x,y) {
    console.log(x,y);
  }
}

function init() {
this._super(...arguments);
}

module('Unit | Utility | codeshift-api', function() {

  let a = 1;

  test('it works', function(assert) {
    let result = codeshiftApi();
    assert.ok(result);
  });
});

let f = [1, "hello", true, 0, -1];
let a = () => { console.log('hello') }
let a = () => console.log('hello')
let a = () => log('hello')
let a = () => 2

let { name, age } = a; 
let a = [1,2,3];
let [x,y,z] = a;
this.a = a;
this.b = 10;

export default class MyComponent extends ReactComponent {
  constructor(a,b) {
    this.a = a;
    this.b = b;
  }

  hello(x,y) {
    console.log(x,y);
  }
}

expect(find(cfPage.fieldPositionOne).textContent.trim()).to.be.contains(fieldOrder[0]);
switch(a) {
  case "hello":
    console.log("hello");
    break;
  default:
    break;
}

try {
  hello();
} catch(ex) {
  foo();
} finally {
  bar();
}
try {
    throw new Error('oops');
  }
  catch (ex) {
      console.error('inner', ex.message);
      throw ex;
    }
  finally {
    console.log('finally');
}
var text = "";

for (var i = 0; i < 10; i++) {
  if (i === 3) {
    continue;
  }
  text = text + i;
}
`;

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

  it('should generate a variable declaration statement', function() {

    const input = fs.readFileSync('test/fixtures/variableDeclaration.input.js', 'utf-8');
    let ast = parse(input);

    let pseudoAst =  buildAST(ast);
    const sampleCode = '';
    const outputAst = parse(sampleCode);  

    // Check the manifested api is working fine
    pseudoAst.forEach(n => outputAst.program.body.push(eval(n)));

    const code = print(outputAst, { quote: 'single'}).code;
    const output = fs.readFileSync('test/fixtures/variableDeclaration.output.js', 'utf-8');

    assert.strictEqual(code, output);

  });

  it('should generate an import declaration statement', function() {

    const input = fs.readFileSync('test/fixtures/importStatement.input.js', 'utf-8');
    let ast = parse(input);

    let pseudoAst =  buildAST(ast);
    const sampleCode = '';
    const outputAst = parse(sampleCode);  

    // Check the manifested api is working fine
    pseudoAst.forEach(n => outputAst.program.body.push(eval(n)));

    const code = print(outputAst, { quote: 'single'}).code;
    const output = fs.readFileSync('test/fixtures/importStatement.output.js', 'utf-8');

    assert.strictEqual(code, output);

  });
});
