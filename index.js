const core = require('./lib/core');
const {
  blockStatement,
  callExpression,
  classDeclaration,
  exportDefaultDeclaration,
  expressionStatement,
  functionDeclaration,
  ifStatement,
  importDeclaration,
  variableDeclaration,
  returnStatement,
  switchStatement,
  tryStatement,
  forStatement,
  forInStatement,
  forOfStatement,
  arrowFunctionExpression,
} = core;

function buildAST(ast, wrapExpression = true) {

    // Build the jscodeshift api 
    let _ast = ast.program.body.map(node => {

      switch(node.type) {
        case 'VariableDeclaration':
          return variableDeclaration(node);

        case 'ImportDeclaration':
          return importDeclaration(node);

        case 'ExpressionStatement':
          return wrapExpression ? expressionStatement(node) : callExpression(node.expression);

        case 'IfStatement':
          return ifStatement(node);

        case 'ExportDefaultDeclaration':
          return exportDefaultDeclaration(node);

        case 'ClassDeclaration':
          return classDeclaration(node);

        case 'FunctionDeclaration':
          return functionDeclaration(node);

        case 'ArrowFunctionExpression':
          return arrowFunctionExpression(node);

        case 'ReturnStatement':
          return returnStatement(node);

        case 'SwitchStatement':
          return switchStatement(node);

        case 'TryStatement':
          return tryStatement(node);

        case 'ForStatement':
          return forStatement(node);

        case 'ForInStatement':
          return forInStatement(node);

        case 'ForOfStatement':
          return forOfStatement(node);

        case 'BlockStatement':
          return blockStatement(node);

        default:
          console.log('buildAST => ', node.type); // eslint-disable-line
          return '';
      }

    });

    return _ast;
}

module.exports = {
  buildAST,
  core
}
