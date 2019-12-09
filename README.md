# ast-node-builder

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Frajasegar%2Fast-node-builder%2Fbadge&style=flat&label=build)](https://actions-badge.atrox.dev/rajasegar/ast-node-builder/goto)
[![Coverage Status](https://coveralls.io/repos/github/rajasegar/ast-node-builder/badge.svg?branch=refs/heads/master)](https://coveralls.io/github/rajasegar/ast-node-builder?branch=refs/heads/master)
[![Version](https://img.shields.io/npm/v/ast-node-builder.svg)](https://npmjs.org/package/ast-node-builder)

Checkout the api in this [Playground](https://rajasegar.github.io/ast-builder/)

Read the [introductory blog post](http://hangaroundtheweb.com/2019/12/ast-builder-building-ast-nodes-from-code/) to know more about the tool.

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



