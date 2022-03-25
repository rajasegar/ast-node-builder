function stringLiteral(node) {
  return  `j.stringLiteral('${node.value}')`;
}

function numericLiteral(node) {
  return  `j.numericLiteral(${node.value})`;
}

function booleanLiteral(node) {
  return  `j.booleanLiteral(${node.value})`;
}

function nullLiteral() {
  return  `j.nullLiteral()`;
}

function regExpLiteral(node) {
  let { pattern, flags } = node;
  let str = '';
  str = `j.regExpLiteral(
  "${pattern}",
  '${flags}'
  )`;
  return str;
}

export {
  stringLiteral,
  numericLiteral,
  booleanLiteral,
  nullLiteral,
  regExpLiteral
};
