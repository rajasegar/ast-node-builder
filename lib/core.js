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




function buildArgs(params) {
  let str = params.map(p => {
    switch(p.type) {
      case 'StringLiteral':
      case 'NumericLiteral':
      case 'BooleanLiteral':
      case 'Literal':
        return  literal(p);

      case 'Identifier':
        return identifier(p);

      case 'FunctionExpression':
        return functionExpression(p);

      case 'CallExpression':
        return callExpression(p);

      case 'MemberExpression':
        return memberExpression(p);

      case 'ArrayExpression':
        return arrayExpression(p);

      case 'UnaryExpression':
        return unaryExpression(p);

      case 'ObjectExpression':
        return objectExpression(p);

      default:  
        console.log('buildArgs => ', p.type); // eslint-disable-line
        return '';
    }
  });

  return str.join(',');
}

function callExpression(expression) {
  let { arguments: args, callee } = expression;
  if(callee.type === 'MemberExpression') {
    return `j.callExpression(
          ${memberExpression(callee)},
          [${buildArgs(args)}]
        )`;
  } else {
    return `j.callExpression(
          ${identifier(callee)},
          [${buildArgs(args)}]
        )`;
  }
}




function arrayExpression(node) {
  let { elements } = node;
  let items = elements.map(e => {
    switch(e.type) {
      case 'Literal':
        return literal(e);
      case 'UnaryExpression':
        return unaryExpression(e);
      default:
        console.log('arrayExpression => ', e.type);
        return '';
    }
  }).join(',');

  return `j.arrayExpression([${items}])`;
}



function logicalExpression(node) {
  let { operator, left, right } = node;
  let str = '';
  str =  `j.logicalExpression(
  '${operator}',
  ${buildValue(left)},
  ${buildValue(right)},
  )`;
  return str;
}

function conditionalExpression(node) {
  let str = '';
  let { test, consequent, alternate } = node;
  str = `j.conditionalExpression(
  ${buildValue(test)},
  ${buildValue(consequent)},
  ${buildValue(alternate)},
  )`;
  return str;
}

function awaitExpression(node) {
  let str = '';
  let { argument } = node;
  str = `j.awaitExpression(${buildValue(argument)})`;
  return str;
}

function buildValue(node) {
  switch(node.type) {
    case "Literal":
      return literal(node);
    case "ObjectExpression":
      return objectExpression(node);
    case "CallExpression":
      return callExpression(node);
    case "ArrayExpression":
      return arrayExpression(node);
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
    case 'UnaryExpression':
      return unaryExpression(node);
    case 'AwaitExpression':
      return awaitExpression(node);
    case 'FunctionExpression':
      return functionExpression(node);
    default:
      console.log('buildValue => ', node.type); // eslint-disable-line
      return '';
  }
}

function objectExpression(node) {
  let { properties } = node;
  let str = properties.map(p => {
    return property(p);
  });
  return `j.objectExpression([${str.join(',')}])`;
}

function property(node) {
    let { key, value } = node;
    let _key = '';
    switch(key.type) {
      case 'Identifier':
        _key = identifier(key);
        break;

      case 'Literal':
        _key = literal(key);
        break;

      default:
        console.log('objectExpression::key => ', key.type);
        break;

    }
    return `j.property("init", ${_key}, ${buildValue(value)})`;
}

function buildProperties(props) {
  return props.map(p => {
    return property(p);
  }).join(',');
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
  
  let str = `j.variableDeclaration(
  '${kind}',
      [${variableDeclarator(declarations[0])}])`;
           
  return str;
}


function memberExpression(node) {
  let str = '';
  let { object, property, computed } = node;
  let obj = '';

  // Constructing object of a MemberExpression
  switch(object.type) {
    case 'ThisExpression':
      obj = `j.thisExpression()`;
      break;

    case 'MemberExpression':
      obj = `${memberExpression(object)}`;
      break;

    case 'Identifier':
      obj = identifier(object);
      break;

    case 'CallExpression':
      obj = callExpression(object);
      break;

    default:
      console.log('memberExpression => ', object.type);  // eslint-disable-line
      break;
  }

  let prop = '';
  // Constructing property of a MemberExpression
  switch(property.type) {
    case 'Identifier':
      prop = identifier(property);
      break;

    case 'Literal':
      prop = literal(property);
      break;

    case 'CallExpression':
      prop = callExpression(property);
      break;

    default:
      console.log('memberExpression.property => ', property.type); // eslint-disable-line
      break;
  }

str = `j.memberExpression(
 ${obj},
 ${prop},
 ${computed}
  )`;
  return str;
}

function assignmentExpression(node) {
  let str = '';
  let { operator, left, right } = node;
  switch(left.type) {
    case 'Identifier':
      str = `j.assignmentExpression(
        '${operator}',
        ${identifier(left)},
        ${buildValue(right)}
      )`;
      break;
    case 'MemberExpression':
      str = `j.assignmentExpression(
        '${operator}',
        ${memberExpression(left)},
        ${buildValue(right)}
      )`;
      break;
  }
  return str;
}





function expressionStatement(node) {
  let { expression } = node;
  let { extra } = expression;
  let str = '';
  switch(expression.type) {
    case 'MemberExpression':
      str = `j.expressionStatement(${memberExpression(expression)})`;
      break;

    case 'CallExpression':
      if(extra && extra.parenthesized) {
        str = `j.expressionStatement(
       j.parenthesizedExpression(
       ${callExpression(expression)}
       ))`;
      } else {
        str = `j.expressionStatement(${callExpression(expression)})`;
      }
      break;

    case 'AssignmentExpression':
      str = `j.expressionStatement(${assignmentExpression(expression)})`;      
      break;

    case 'Identifier':
      str = `j.expressionStatement(${identifier(expression)})`;
      break;

    case 'BinaryExpression':
      str = binaryExpression(expression);
      break;

    case 'Literal':
      str = `j.expressionStatement(${literal(expression)})`;
      break;

    default:
      console.log('expressionStatement => ', expression.type); // eslint-disable-line
      break;
  }
    
  return str;
}

function returnStatement(node) {
  let { argument: arg } = node;
  let str = '';
  switch(arg.type) {
    case 'CallExpression':
      str = `j.returnStatement(${callExpression(arg)})`;
      break;

    case 'Identifier':
      str = `j.returnStatement(${identifier(arg)})`;
      break;

    case 'MemberExpression':
      str = `j.returnStatement(${memberExpression(arg)})`;
      break;

    case 'Literal':
      str = `j.returnStatement(${literal(arg)})`;
      break;

    case 'BinaryExpression':
      str = `j.returnStatement(${binaryExpression(arg)})`;
      break;

    case 'ObjectExpression':
      str = `j.returnStatement(${objectExpression(arg)})`;
      break;

    case 'NewExpression':
      str = `j.returnStatement(${newExpression(arg)})`;
      break;

    default:
      console.log('returnStatement => ', arg.type); // eslint-disable-line
      break;
  }

  return str;
}


function newExpression(node) {
  let { callee, arguments: args } = node;
  return `j.newExpression(
  ${buildCallee(callee)},
  [${buildArgs(args)}]
  )`;
}
function throwStatement(node) {
  let { argument } = node;
  let arg = '';
  switch(argument.type) {
    case 'NewExpression':
      arg = newExpression(argument);
      break;

    case 'Identifier':
      arg = identifier(argument);
      break;

    default:
      console.log('thowStatement => ', argument.type); // eslint-disable-line
      break;
      
  }
  return `j.throwStatement(
  ${arg}
  )`;
}


function buildBlock(body) {
  // Build the jscodeshift api 
  let _ast = body.map(node => {

    switch(node.type) {
      case 'VariableDeclaration':
        return variableDeclaration(node);

      case 'ExpressionStatement':
        return expressionStatement(node);

      case 'IfStatement':
        return ifStatement(node);

      case 'FunctionDeclaration':
        return functionDeclaration(node);

      case 'ReturnStatement':
        return returnStatement(node);

      case 'BreakStatement':
        return breakStatement();

      case 'ThrowStatement':
        return throwStatement(node);

      case 'ContinueStatement':
        return continueStatement();

      default:
        console.log('buildBlock => ', node.type); // eslint-disable-line
        return '';
    }

  });

  return _ast.join(',');
}


function ifStatement(node) {
  let { test, consequent, alternate } = node;
  let str = '';
  let condition;
  if(test.type === 'BinaryExpression') {
    let { operator, left, right } = test;
    condition = `j.binaryExpression('${operator}', j.identifier('${left.name}'), ${literal(right)})`;
  } else if(test.type === 'Identifier') {
    condition = `j.identifier(${test.name})`;
  }

  if(alternate) {
    str = `j.ifStatement(
  ${condition},
  j.blockStatement([${buildBlock(consequent.body)}]),
  j.blockStatement([${buildBlock(alternate.body)}])
  )`;
  } else {
    str = `j.ifStatement(
  ${condition},
  j.blockStatement([${buildBlock(consequent.body)}])
  )`;
  }
  return str;
}


function functionDeclaration(node) {
  let str = '';
  let { id, body, params, generator, expression } = node;
  str = `j.functionDeclaration(
  j.identifier('${id.name}'),
  [${buildArgs(params)}],
  j.blockStatement([${buildBlock(body.body)}]),
  ${generator},
  ${expression}
  )`;
  return str;
}

function functionExpression(node) {
  let str = '';
  let { id, body, params } = node;
  if(id) {
    str = `j.functionExpression(
  j.identifier('${id.name}'),
  [${buildArgs(params)}],
  j.blockStatement([${buildBlock(body.body)}])
  )`;
  } else {

    str = `j.functionExpression(
  null,
  [${buildArgs(params)}],
  j.blockStatement([${buildBlock(body.body)}])
  )`;
  }
  return str;
}



function buildSwitchCases(cases) {
  return cases.map(c => {
    let { test, consequent } = c;
    let str = '';
    if(test) {
    switch(test.type) {
      case 'Literal':
        str = `j.switchCase(${literal(test)}, [${buildBlock(consequent)}])`; 
        break;

      default:
        console.log('buildSwitchCases => ', test.type); // eslint-disable-line
        break;
    }
    } else {
        str =  `j.switchCase(null, [${buildBlock(consequent)}])`; 
    }
    return str;
  }).join(',');
}

function switchStatement(node) {
  let str = '';
  let { cases, discriminant } = node;
  let d = '';
  switch(discriminant.type) {
    case 'Identifier':
      d = identifier(discriminant);
      break;

    default:
      console.log('switchStatement::discriminant => ', discriminant.type); // eslint-disable-line
      break;
      
  }
  str = `j.switchStatement(${d},[${buildSwitchCases(cases)}])`;
  return str;
}

function catchClause(node) {
  let { param, body } = node;
  return `j.catchClause(
  ${identifier(param)},
  null,
  ${blockStatement(body)}
  )`;
}

function blockStatement(node) {
  return `j.blockStatement([${buildBlock(node.body)}])`;
}
function tryStatement(node) {
  let str = '';
  let { block, handler, finalizer } = node;
  str = `j.tryStatement(
    ${blockStatement(block)},
    ${catchClause(handler)},
    ${blockStatement(finalizer)}
  )`;
  return str;
}



function forStatement(node) {
  let { init, test, update, body } = node;
  let str = '';
  let _init = '';
  let _test = '';
  let _update = '';

  // Building for init
  switch(init.type) {
    case 'VariableDeclaration':
      _init = variableDeclaration(init);
      break;

    default:
      console.log('forStatement::init =>', init.type); // eslint-disable-line
      break;
  }

  // Building for test
  switch(test.type) {
    case 'BinaryExpression':
      _test = binaryExpression(test);
      break;

    default:
      console.log('forStatement::test => ', test.type); // eslint-disable-line
      break;
  }

  // Building for update
  switch(update.type) {
    case 'UpdateExpression':
      _update = updateExpression(update);
      break;

    default:
      console.log('forStatement::test => ', update.type); // eslint-disable-line
      break;
  }

  str = `j.forStatement(
    ${_init},
    ${_test},
    ${_update},
    ${blockStatement(body)}
  )`;
  return str;
}


module.exports = {
  blockStatement,
  callExpression,
  memberExpression,
  assignmentExpression,
  identifier,
  binaryExpression,
  expressionStatement,
  functionDeclaration,
  ifStatement,
  variableDeclaration,
  returnStatement,
  switchStatement,
  tryStatement,
  forStatement
}

