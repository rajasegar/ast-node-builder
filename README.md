# ast-node-builder

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Frajasegar%2Fast-node-builder%2Fbadge&style=flat&label=build)](https://actions-badge.atrox.dev/rajasegar/ast-node-builder/goto)
[![Coverage Status](https://coveralls.io/repos/github/rajasegar/ast-node-builder/badge.svg?branch=master)](https://coveralls.io/github/rajasegar/ast-node-builder?branch=master)
[![Version](https://img.shields.io/npm/v/ast-node-builder.svg)](https://npmjs.org/package/ast-node-builder)

Checkout the api in this [Playground](https://rajasegar.github.io/ast-builder/)

Build your Abstract Syntax Trees (AST) directly from code. 
You give the input in the form of code and get the builder API in [jscodeshift](https://github.com/facebook/jscodeshift).

## Usage
```js
const { classDeclaration } = require('ast-node-builder');
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

console.log(classDeclaration(code));
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



