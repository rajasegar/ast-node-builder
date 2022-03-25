function literal(node) {
  let value = typeof node.value === 'string'  ? `'${node.value}'` : node.value;
  return `j.literal(${value})`;
}

function identifier(node) {
  return `j.identifier('${node.name}')`;
}

function breakStatement() {
  return `j.breakStatement()`;
}

function continueStatement() {
  return `j.continueStatement()`;
}

function updateExpression(node) {
  let { operator, argument, prefix } = node;
  return `j.updateExpression(
  '${operator}', 
  ${identifier(argument)},
  ${prefix}
  )`;
}

function binaryExpression(node) {
  let { operator, left, right } = node;

  let _left = '';
  let _right = '';

  switch(left.type) {
    case 'Identifier':
      _left = identifier(left);
      break;

    default:
      console.log('binaryExpression::left => ', left.type); // eslint-disable-line
      break;
  }

  switch(right.type) {
    case 'Literal':
      _right = literal(right);
      break;

    case 'BinaryExpression':
      _right = binaryExpression(right);
      break;

    case 'Identifier':
      _right = identifier(right);
      break;

    default:
      console.log('binaryExpression::right => ', right.type); // eslint-disable-line
      break;
    
  }

  return  `j.binaryExpression(
    '${operator}', 
    ${_left},
    ${_right}
  )`;
}


function unaryExpression(node) {
  let { argument, operator, prefix } = node;
  return `j.unaryExpression('${operator}', ${literal(argument)}, ${prefix})`;
}

function buildCallee(node) {
  let str = '';
  switch(node.type) {
    case 'Identifier':
      str = identifier(node);
      break;

    default:
      console.log('buildCallee => ', node.type); // eslint-disable-line
      break;
  }

  return str;
}

function buildElements(elements) {
  return elements.map(e => {
    return identifier(e);
  }).join(',');
}

export {
  literal,
  identifier,
  breakStatement,
  updateExpression,
  continueStatement,
  binaryExpression,
  unaryExpression,
  buildCallee,
  buildElements
};

