import {
  blockStatement,
  callExpression,
  expressionStatement,
  functionDeclaration,
  ifStatement,
  variableDeclaration,
  returnStatement,
  switchStatement,
  tryStatement,
  forStatement,
} from './lib/core.js';

import * as jsx from './lib/jsx.js';
import * as glimmer from './lib/glimmer-hbs.js';
import * as es6 from './lib/es6.js';

function buildAST(ast, wrapExpression = true) {

    // Build the jscodeshift api 
    let _body = ast && ast.program ? ast.program.body : [];
    let _ast = _body.map(node => {

      switch(node.type) {
        case 'VariableDeclaration':
          return variableDeclaration(node);

        case 'ExpressionStatement':
          return wrapExpression ? expressionStatement(node) : callExpression(node.expression);

        case 'IfStatement':
          return ifStatement(node);

        case 'EmptyStatement':
          return 'j.emptyStatement()';

        case 'FunctionDeclaration':
          return functionDeclaration(node);

        case 'ReturnStatement':
          return returnStatement(node);

        case 'SwitchStatement':
          return switchStatement(node);

        case 'TryStatement':
          return tryStatement(node);

        case 'ForStatement':
          return forStatement(node);

        case 'BlockStatement':
          return blockStatement(node);

        default:
          console.log('buildAST => ', node.type); // eslint-disable-line
          return '';
      }

    });

    return _ast;
}

export {
  buildAST,
  es6,
  glimmer,
  jsx
}
