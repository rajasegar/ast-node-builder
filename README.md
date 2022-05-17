# ast-node-builder

WARNING: This package is moved here
https://github.com/rajasegar/ast-tooling/tree/master/packages/ast-node-builder

Checkout the api in this [Playground](https://rajasegar.github.io/ast-builder/)

Read the [introductory blog post](https://dev.to/rajasegar/building-ast-nodes-from-source-code-3p49) to know more about the tool.

Build your Abstract Syntax Trees (AST) directly from code. 
You give the input in the form of code and get the builder API in [jscodeshift](https://github.com/facebook/jscodeshift).

## Usage
```js
const { buildAST } = require('ast-node-builder');
const { parse }  = require('recast');
const code = `
class MyComponent extends ReactComponent {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  hello(x, y) {
    console.log(x, y);
  }
}
`;

let ast = parse(code);

let pseudoAst =  buildAST(ast);
console.log(pseudoAst);
```

### Output
```js
j.classDeclaration(
  j.identifier('MyComponent'),
  j.classBody([j.methodDefinition(
    'constructor',
    j.identifier('constructor'),
    j.functionExpression(
      null,
      [j.identifier('a'),j.identifier('b')],
      j.blockStatement([j.expressionStatement(j.assignmentExpression(
        '=',
        j.memberExpression(
          j.thisExpression(),
          j.identifier('a'),
          false
        ),
        j.identifier('a')
      )),j.expressionStatement(j.assignmentExpression(
        '=',
        j.memberExpression(
          j.thisExpression(),
          j.identifier('b'),
          false
        ),
        j.identifier('b')
      ))])
    ),
    false
  ),j.methodDefinition(
    'method',
    j.identifier('hello'),
    j.functionExpression(
      null,
      [j.identifier('x'),j.identifier('y')],
      j.blockStatement([j.expressionStatement(j.callExpression(
        j.memberExpression(
          j.identifier('console'),
          j.identifier('log'),
          false
        ),
        [j.identifier('x'),j.identifier('y')]
      ))])
    ),
    false
  )]),
  j.identifier('ReactComponent')
)

```

## Debugging
Place `debugger` statements in the code in appropriate places and run:

```
$ npm run debug
```

This will start mocha tests in debug mode and you can use Chrome Dev Tools to view the debugger.



