const core = require('./lib/core');
const {
  blockStatement,
  callExpression,
  classDeclaration,
  exportDefaultDeclaration,
  exportNamedDeclaration,
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

const jsx = require('./lib/jsx');
const glimmer = require('./lib/glimmer-hbs');

function buildAST(ast, wrapExpression = true) {

    // Build the jscodeshift api 
    let _body = ast && ast.program ? ast.program.body : [];
    let _ast = _body.map(node => {

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

        case 'ExportNamedDeclaration':
          return exportNamedDeclaration(node);

        case 'EmptyStatement':
          return 'j.emptyStatement()';

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

        case 'JSXElement':
          return jsx.element(node);

        default:
          console.log('buildAST => ', node.type); // eslint-disable-line
          return '';
      }

    });

    return _ast;
}

module.exports = {
  buildAST,
  core,
  glimmer
}
