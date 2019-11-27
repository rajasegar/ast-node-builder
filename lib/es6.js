const {
  identifier
} = require('./core/base');

function spreadElement(node) {
  return `j.spreadElement(${identifier(node.argument)})`;
}

function templateElementValue(value) {
  return `{cooked: "${value.cooked.replace('\n','\\n')}", raw: "${value.raw.replace('\n','\\n')}"}`;
}

function templateElement(node) {
  let str = '';
  let { value, tail } = node;
  str = `j.templateElement(
  ${templateElementValue(value)},
  ${tail}
  )`;
  return str;
}
function templateLiteral(node) {
  let str = '';
  let { expressions, quasis } = node;
  let _expressions = expressions.map(e => identifier(e)).join(',');
  let _quasis = quasis.map(q => templateElement(q)).join(',');
  str =   `j.templateLiteral(
  [${_quasis}],
  [${_expressions}]
  )`;
  return str;
}

function taggedTemplateExpression(node) {
  let { tag, quasi } = node;
  let str = '';
  str = `j.taggedTemplateExpression(
  ${identifier(tag)},
  ${templateLiteral(quasi)}
  )`;
  return str;
}

module.exports = {
  spreadElement,
  templateLiteral,
  taggedTemplateExpression
};

