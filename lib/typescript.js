const {
  literal,
  identifier,
  breakStatement,
  updateExpression,
  continueStatement,
  binaryExpression,
  unaryExpression,
  buildCallee,
  buildElements
} = require('./core/base');

function buildValue(node) {
  switch(node.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
    case "Literal":
      return literal(node);
    case "ObjectExpression":
      return objectExpression(node);
    case "CallExpression":
      return callExpression(node);
    case "ArrayExpression":
      return arrayExpression(node);
    case "ArrowFunctionExpression":
      return arrowFunctionExpression(node);
    case "Identifier":
      return identifier(node);
    case "MemberExpression":
      return memberExpression(node);
    case 'BinaryExpression':
      return binaryExpression(node);
    case 'NewExpression':
      return newExpression(node);
    case 'LogicalExpression':
      return logicalExpression(node);
    case 'ConditionalExpression':
      return conditionalExpression(node);
    case 'TemplateLiteral':
      return templateLiteral(node);
    case 'ClassExpression':
      return classExpression(node);
    case 'UnaryExpression':
      return unaryExpression(node);
    case 'AwaitExpression':
      return awaitExpression(node);
    case 'FunctionExpression':
      return functionExpression(node);
    case 'JSXElement':
      return jsx.element(node);
    default:
      console.log('buildValue => ', node.type); // eslint-disable-line
      return '';
  }
}
function variableDeclarator(node) {
  let str = '';
  let { id, init}  = node;
  let value = init ? buildValue(init) : null;
  switch(id.type) {
    case 'Identifier':
      str = `j.variableDeclarator(
      j.identifier('${id.name}'),
        ${value}
          )`;
      break;
    case 'ObjectPattern':
      str = `j.variableDeclarator(
      j.objectPattern([${buildProperties(id.properties)}]),
        ${value}
          )`;
      break;
    case 'ArrayPattern':
      str = `j.variableDeclarator(
      j.arrayPattern([${buildElements(id.elements)}]),
        ${value}
          )`;
      break;
  }
  return str;
}
function variableDeclaration(node) {
  let { kind, declarations } = node;
  
  let str = `ts.createVariableDeclaration(
  '${kind}',
      [${variableDeclarator(declarations[0])}])`;
           
  console.log(str);
  return str;
}

function buildAST(ast) {
  
// Build the Typescript node api
  let _body = ast && ast.program.body ? ast.program.body : [];
  let _ast = _body.map(node => {
    switch (node.type) {

      case 'VariableDeclaration':
        //node.declarations.forEach(d => console.log(d));
        return variableDeclaration(node);

      default:
        console.log("buildAST => ", node.type); // eslint-disable-line
    }
  });

  return _ast;
}

module.exports = {
  buildAST
};
