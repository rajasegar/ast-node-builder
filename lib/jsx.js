const base = require('./core/base');

function identifier(node) {
  return `j.jsxIdentifier('${node.name}')`;
}

function attribute(node) {
  let str = '';
  const { name, value } = node;
  str = `j.jsxAttribute(
  ${identifier(name)},
  j.literal('${value.value}')
)`;
  return str;
}

function buildAttributes(attrs) {
  let str = '';

  str = attrs.map(attr => {
    return attribute(attr);
  });

  return str.join(',');
}
function openingElement(node) {
  const { attributes, name, selfClosing } = node;
  let str = '';
  str = `j.jsxOpeningElement(
    ${identifier(name)},
    [${buildAttributes(attributes)}],
    ${selfClosing}
  )`;
  return str;
}
function closingElement(node) {
  const { name } = node;
  let str = '';
  str = `j.jsxClosingElement(
    ${identifier(name)}
  )`;
  return str;
}
// TODO: Need to remove from here
function callExpression(expression) {
  let { arguments: args, callee } = expression;
  if(callee.type === 'MemberExpression') {
    return `j.callExpression(
          ${memberExpression(callee)},
          [${buildArgs(args)}]
        )`;
  } else {
    return `j.callExpression(
          ${base.identifier(callee)},
          [${buildArgs(args)}]
        )`;
  }
}
// TODO: Need to remove from here
function arrayExpression(node) {
  let { elements } = node;
  let items = elements.map(e => {
    switch(e.type) {
      case 'Literal':
        return base.literal(e);
      //case 'UnaryExpression':
      //  return unaryExpression(e);
      //case 'SpreadElement':
      //  return spreadElement(e);
      case 'MemberExpression':
        return memberExpression(e);
      default:
        console.log('arrayExpression => ', e.type);
        return '';
    }
  }).join(',');

  return `j.arrayExpression([${items}])`;
}
// TODO: Need to remove from here
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
      obj = base.identifier(object);
      break;

    case 'CallExpression':
      obj = callExpression(object);
      break;

    case 'ArrayExpression':
      obj = arrayExpression(object);
      break;

    default:
      console.log('memberExpression => ', object.type);  // eslint-disable-line
      break;
  }

  let prop = '';
  // Constructing property of a MemberExpression
  switch(property.type) {
    case 'Identifier':
      prop = base.identifier(property);
      break;

    case 'Literal':
      prop = base.literal(property);
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

// TODO: Need to remove from here
function buildArgs(params) {
  let str = params.map(p => {
    switch(p.type) {
      case 'Literal':
        return  base.literal(p);

      case 'Identifier':
        return base.identifier(p);

      case 'StringLiteral':
        return base.literal(p);

      default:  
        console.log('buildArgs => ', p.type); // eslint-disable-line
        return '';
    }
  });

  return str.join(',');
}
function expressionContainer(node) {
  let str = '';
  const { expression } = node;
  let expr = '';
  switch(expression.type) {
    case 'CallExpression':
      expr = callExpression(expression);
      break;

    default:
      console.log('JSX::expressionContainer => ', expression.type);
      break;
  }

  str = `j.jsxExpressionContainer(${expr})`;
  return str;
}
function buildChildren(children) {
  let str = children.map(child => {
    let s = '';
    switch(child.type) {
      case 'Literal':
        s = `j.literal('${child.value.replace('\n','\\n')}')`;
        break;

      case 'JSXElement':
        s = element(child);
        break;

      case 'JSXText':
        s = `j.jsxText('${child.value.replace('\n','\\n')}')`;
        break;

      case 'JSXExpressionContainer':
        s = expressionContainer(child);
        break;

      default:
        console.log('JSX::buildChildren => ', child.type);
        break;

    }
    return s;
  });
  return str.join(',');
}
function element(node) {
  let str = ''
  const { 
    openingElement: oe, 
    closingElement: ce, 
    children,
    extra
  } = node;

  let parenthesized = extra && extra.parenthesized ? true : false;
  if(ce !== null) {
    str = `j.jsxElement(
  ${openingElement(oe)},
  ${closingElement(ce)},
  [${buildChildren(children)}],
  ${parenthesized}
  )`;
  } else {
    str = `j.jsxElement(
  ${openingElement(oe)},` +
  'null,' +
  `[${buildChildren(children)}],
  ${parenthesized}
  )`;
  }
  return str;
}


module.exports = {
  attribute,
  element
};
