function textNode(node) {
  // To escape newline characters inside template literals
  let t = node.chars.replace(/\n/g, "\\n");
  return `b.text("${t}")`;
}

// Build element attributes
function buildAttributes(attrs) {
  let _attrs = attrs.map(a => {
    switch (a.value.type) {
      case "TextNode":
        return `b.attr('${a.name}', ${textNode(a.value)})`;

      case "MustacheStatement":
        return `b.attr('${a.name}', ${mustacheStatement(a.value)})`;

      default:
        console.log("buildAttributes => ", a.value.type); // eslint-disable-line
        return "";
    }
  });

  return _attrs.join(",");
}

// Extracted from ember-angle-brackets-codemod transform
function transformNestedSubExpression(subExpression) {
  let positionalArgs = subExpression.params.map(param => {
    if (param.type === "SubExpression") {
      return transformNestedSubExpression(param);
    } else if (param.type === "StringLiteral") {
      return `"${param.original}"`;
    } else {
      return param.original;
    }
  });

  let namedArgs = [];
  if (subExpression.hash.pairs.length > 0) {
    namedArgs = subExpression.hash.pairs.map(pair => {
      if (pair.value.type === "SubExpression") {
        let nestedValue = transformNestedSubExpression(pair.value);
        return `${pair.key}=${nestedValue}`;
      } else {
        if (pair.value.type === "StringLiteral") {
          return `${pair.key}="${pair.value.original}"`;
        }
        return `${pair.key}=${pair.value.original}`;
      }
    });
  }

  let args = positionalArgs.concat(namedArgs);
  return `(${subExpression.path.original} ${args.join(" ")})`;
}

// Build Params for Mustache Statements
// Extracted from ember-angle-brackets-codemod transform
function buildParams(params) {
  return params
    .map(p => {
      switch (p.type) {
        case "SubExpression":
          return transformNestedSubExpression(p);

        case "StringLiteral":
          return `b.string('${p.original}')`;

        case "NullLiteral":
          return "null";

        case "UndefinedLiteral":
          return "undefined";

        case 'PathExpression':
          return  `b.path('${p.original}')`;

        default:
          console.log("buildParams => ", p.type); // eslint-disable-line
          break;
      }
    })
    .join(" ");
}

// Build Params for Block Statements
function buildBlockStatementParams(params) {
  return params
    .map(p => {
      return `b.path('${p.original}')`;
    })
    .join(",");
}

function mustacheStatement(node) {
  let { params, hash } = node;
  return `b.mustache(
      b.path('${node.path.original}'),
      [${buildParams(params)}],
      b.hash([${buildHash(hash)}]),
    )`;
}
function buildChildren(children) {
  return children
    .map(child => {
      switch (child.type) {
        case "TextNode":
          return textNode(child);

        case "ElementNode":
          return elementNode(child);

        case "MustacheStatement":
          return mustacheStatement(child);

        case "BlockStatement":
          return blockStatement(child);

        default:
          console.log("buildchildren => ", child.type); // eslint-disable-line
          return "";
      }
    })
    .join(",");
}
function elementNode(node) {
  let { selfClosing, tag, attributes, children, blockParams } = node;
  return `b.element({name: '${tag}', selfClosing: ${selfClosing}},
    {
    attrs: [${buildAttributes(attributes)}],
    children: [${buildChildren(children)}],
    blockParams: [${blockParams.map(b => `'${b}'`).join(',')}]
    }
  )`;
}

function buildSubExpression(node) {
  let str = '';
  let { params } = node;
  let args = params.map(param => {
    switch(param.type) {
      case 'SubExpression':
        return buildSubExpression(param);

      case 'StringLiteral':
        return `b.string('${param.original}')`;

      case 'PathExpression':
        return  `b.path('${param.original}')`;

      default:
        console.log('Glimmer::buildSubExpression => ', param.type);
        break;
    }
  });
  str = `b.sexpr(
  '${node.path.original}',
  [${args.join(',')}]
  )`;
  return str;
}

function buildHash(node) {
  let { pairs } = node;
  let str = '';
  str = pairs.map(p => {
    let { key, value } = p;
    switch(value.type) {
      case 'SubExpression':
        return `b.pair('${key}', ${buildSubExpression(value)})`;

      case 'StringLiteral':
        return `b.pair('${key}', b.string('${value.value}'))`;

      case 'NumberLiteral':
        return `b.pair('${key}', b.number('${value.original}'))`;

      case 'PathExpression':
        return  `b.pair('${key}', b.path('${value.original}'))` ;

      case 'BooleanLiteral':
        //return value.original 
          //? `b.pair('${key}', b.boolean('true'))`
          //: `b.pair('${key}', b.boolean('false'))`;
        return `b.pair('${key}', b.boolean(${value.original}))`;

      default:
        console.log('Glimmer::buildHash =>', value.type);
        break;
    }
  }).join(',');
  return str;
}

function buildBlockParams(node) {
  return node.map(s => {
    return `'${s}'`;
  }).join(',');
}
function blockStatement(node) {
  let { path, program, params, hash } = node;
  return `b.block(
        b.path('${path.original}'),
        [${buildBlockStatementParams(params)}],
        b.hash([${buildHash(hash)}]),
        b.blockItself(
          [${buildChildren(program.body)}], 
          [${buildBlockParams(program.blockParams)}])
      )`;
}
function buildAST(ast) {
  // Build the Glimmer template api
  let _body = ast && ast.body ? ast.body : [];
  let _ast = _body.map(node => {
    switch (node.type) {
      case "TextNode":
        return textNode(node);

      case "ElementNode":
        return elementNode(node);

      case "BlockStatement":
        return blockStatement(node);

      case 'MustacheStatement':
        return mustacheStatement(node);

      default:
        console.log("buildAST => ", node.type); // eslint-disable-line
    }
  });

  return _ast;
}

export {
  textNode,
  elementNode,
  buildAST
};
