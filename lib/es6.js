import {
  identifier,
  breakStatement,
  continueStatement,
  buildCallee,
  buildElements,
} from "./core/base.js";

import {
  stringLiteral,
  numericLiteral,
  booleanLiteral,
  nullLiteral,
  regExpLiteral,
} from "./babel/base.js";

import { element } from "./jsx.js";

function whileStatement(node) {
  let str = "";
  let { test, body } = node;
  switch (test.type) {
    case "BinaryExpression":
      str = `j.whileStatement(
      ${binaryExpression(test)},
      ${blockStatement(body)}
      )`;
      break;

    case "BooleanLiteral":
      str = `j.whileStatement(
      ${booleanLiteral(test)},
      ${blockStatement(body)}
      )`;
      break;

    default:
      console.log("ES6::whileStatement => ", test.type);
      break;
  }
  return str;
}

function logicalExpression(node) {
  let { operator, left, right } = node;
  let str = "";
  str = `j.logicalExpression(
  '${operator}',
  ${buildValue(left)},
  ${buildValue(right)},
  )`;
  return str;
}

function unaryExpression(node) {
  let { argument, operator, prefix } = node;
  let str = "";
  switch (argument.type) {
    case "NumericLiteral":
      str = `j.unaryExpression('${operator}', ${numericLiteral(
        argument
      )}, ${prefix})`;
      break;
    case "MemberExpression":
      str = `j.unaryExpression('${operator}', ${memberExpression(
        argument
      )}, ${prefix})`;
      break;
    default:
      console.log("ES6::unaryExpression => ", argument.type);
      break;
  }
  return str;
}

function binaryExpression(node) {
  let { operator, left, right } = node;

  let _left = "";
  let _right = "";

  switch (left.type) {
    case "Identifier":
      _left = identifier(left);
      break;

    case "CallExpression":
      _left = callExpression(left);
      break;

    case "MemberExpression":
      _left = memberExpression(left);
      break;

    default:
      console.log("ES6::binaryExpression::left => ", left.type); // eslint-disable-line
      break;
  }

  switch (right.type) {
    case "StringLiteral":
      _right = stringLiteral(right);
      break;

    case "BinaryExpression":
      _right = binaryExpression(right);
      break;

    case "Identifier":
      _right = identifier(right);
      break;

    case "NumericLiteral":
      _right = numericLiteral(right);
      break;

    default:
      console.log("ES6::binaryExpression::right => ", right.type); // eslint-disable-line
      break;
  }

  return `j.binaryExpression(
    '${operator}', 
    ${_left},
    ${_right}
  )`;
}

function updateExpression(node) {
  let { operator, argument, prefix } = node;
  let str = "";
  switch (argument.type) {
    case "Identifier":
      str = `j.updateExpression(
  '${operator}', 
  ${identifier(argument)},
  ${prefix}
  )`;
      break;

    case "MemberExpression":
      str = `j.updateExpression(
      '${operator}',
      ${memberExpression(argument)},
      ${prefix}
      )`;
      break;

    default:
      console.log("ES6::updateExpression => ", argument.type);
      break;
  }

  return str;
}
function switchStatement(node) {
  let str = "";
  let { cases, discriminant } = node;
  let d = "";
  switch (discriminant.type) {
    case "Identifier":
      d = identifier(discriminant);
      break;

    default:
      console.log("switchStatement::discriminant => ", discriminant.type); // eslint-disable-line
      break;
  }
  str = `j.switchStatement(${d},[${buildSwitchCases(cases)}])`;
  return str;
}

function buildSwitchCases(cases) {
  return cases
    .map((c) => {
      let { test, consequent } = c;
      let str = "";
      if (test) {
        switch (test.type) {
          default:
            console.log("buildSwitchCases => ", test.type); // eslint-disable-line
            break;
        }
      } else {
        str = `j.switchCase(null, [${buildBlock(consequent)}])`;
      }
      return str;
    })
    .join(",");
}
function forOfStatement(node) {
  let str = "";
  let { left, right, body, each } = node;
  let _right = "";
  switch (right.type) {
    case "Identifier":
      _right = identifier(right);
      break;

    case "CallExpression":
      _right = callExpression(right);
      break;

    default:
      console.log("ES6::forOfStatement.right => ", right.type);
      break;
  }
  if (node.await) {
    str = `(function() {
      var node = j.forOfStatement(
      ${variableDeclaration(left)},
      ${_right},
      ${blockStatement(body)},
      ${each}
      );
      node.await = true;
      return node;
      }())`;
  } else {
    str = `j.forOfStatement(
    ${variableDeclaration(left)},
    ${_right},
    ${blockStatement(body)},
    ${each}
    )`;
  }
  return str;
}
function forInStatement(node) {
  let str = "";
  let { left, right, body, each } = node;
  str = `j.forInStatement(
  ${variableDeclaration(left)},
  ${identifier(right)},
  ${blockStatement(body)},
  ${each}
  )`;
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
  let str = "";
  let { block, handler, finalizer } = node;
  let _handler = handler ? catchClause(handler) : null;
  if (finalizer) {
    str = `j.tryStatement(
    ${blockStatement(block)},
    ${_handler},
    ${blockStatement(finalizer)}
  )`;
  } else {
    str = `j.tryStatement(
    ${blockStatement(block)},
    ${_handler}
  )`;
  }
  return str;
}

function forStatement(node) {
  let { init, test, update, body } = node;
  let str = "";
  let _init = "";
  let _test = "";
  let _update = "";

  // Building for init
  switch (init.type) {
    case "VariableDeclaration":
      _init = variableDeclaration(init);
      break;

    default:
      console.log("forStatement::init =>", init.type); // eslint-disable-line
      break;
  }

  // Building for test
  switch (test.type) {
    case "BinaryExpression":
      _test = binaryExpression(test);
      break;

    default:
      console.log("forStatement::test => ", test.type); // eslint-disable-line
      break;
  }

  // Building for update
  switch (update.type) {
    case "UpdateExpression":
      _update = updateExpression(update);
      break;

    default:
      console.log("forStatement::test => ", update.type); // eslint-disable-line
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
function assignmentExpression(node) {
  let str = "";
  let { operator, left, right } = node;
  switch (left.type) {
    case "Identifier":
      str = `j.assignmentExpression(
        '${operator}',
        ${identifier(left)},
        ${buildValue(right)}
      )`;
      break;
    case "MemberExpression":
      str = `j.assignmentExpression(
        '${operator}',
        ${memberExpression(left)},
        ${buildValue(right)}
      )`;
      break;
  }
  return str;
}
function ifStatement(node) {
  let { test, consequent, alternate } = node;
  let str = "";
  let condition;
  if (test.type === "BinaryExpression") {
    let { operator, left, right } = test;
    let _right = "";
    let _left = "";
    switch (right.type) {
      case "BooleanLiteral":
        _right = booleanLiteral(right);
        break;

      case "NumericLiteral":
        _right = numericLiteral(right);
        break;

      default:
        console.log("ES6::ifStatement.right => ", right.type);
        break;
    }

    switch (left.type) {
      case "Identifier":
        _left = identifier(left);
        break;

      case "BinaryExpression":
        _left = binaryExpression(left);
        break;

      default:
        console.log("ES6::ifStatement.left => ", left.type);
        break;
    }
    condition = `j.binaryExpression(
      '${operator}', 
      ${_left},
      ${_right})`;
  } else if (test.type === "Identifier") {
    condition = `j.identifier('${test.name}')`;
  }

  if (alternate) {
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
  let str = "";
  let { id, body, params, generator } = node;
  if (node.async) {
    str = `(function() {
      var node = j.functionDeclaration(
      j.identifier('${id.name}'),
      [${buildArgs(params)}],
      j.blockStatement([${buildBlock(body.body)}]),
      ${generator},
      ${node.async}
      );
      node.async = ${node.async};
      return node;
      })();
      `;
  } else {
    str = `j.functionDeclaration(
      j.identifier('${id.name}'),
      [${buildArgs(params)}],
      j.blockStatement([${buildBlock(body.body)}]),
      ${generator}
      )`;
  }
  return str;
}

function awaitExpression(node) {
  let str = "";
  let { argument } = node;
  str = `j.awaitExpression(${buildValue(argument)})`;
  return str;
}

function conditionalExpression(node) {
  let str = "";
  let { test, consequent, alternate } = node;
  str = `j.conditionalExpression(
  ${buildValue(test)},
  ${buildValue(consequent)},
  ${buildValue(alternate)},
  )`;
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
  let arg = "";
  switch (argument.type) {
    case "NewExpression":
      arg = newExpression(argument);
      break;

    case "Identifier":
      arg = identifier(argument);
      break;

    default:
      console.log("thowStatement => ", argument.type); // eslint-disable-line
      break;
  }
  return `j.throwStatement(
  ${arg}
  )`;
}

function objectPattern(node) {
  let str = "";
  str = `j.objectPattern([${buildProperties(node.properties)}])`;
  return str;
}

function buildProperties(props) {
  return props
    .map((p) => {
      return property(p);
    })
    .join(",");
}
function variableDeclarator(node) {
  let str = "";
  let { id, init } = node;
  let value = init ? buildValue(init) : null;
  switch (id.type) {
    case "Identifier":
      str = `j.variableDeclarator(
      j.identifier('${id.name}'),
        ${value}
          )`;
      break;
    case "ObjectPattern":
      str = `j.variableDeclarator(
      j.objectPattern([${buildProperties(id.properties)}]),
        ${value}
          )`;
      break;
    case "ArrayPattern":
      str = `j.variableDeclarator(
      j.arrayPattern([${buildElements(id.elements)}]),
        ${value}
          )`;
      break;

    default:
      console.log("ES6::variableDeclarator => ", id.type);
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
function arrayExpression(node) {
  let { elements } = node;
  let items = elements
    .map((e) => {
      switch (e.type) {
        case "UnaryExpression":
          return unaryExpression(e);
        case "SpreadElement":
          return spreadElement(e);
        case "StringLiteral":
          return stringLiteral(e);
        case "NumericLiteral":
          return numericLiteral(e);
        default:
          console.log("ES6::arrayExpression => ", e.type);
          return "";
      }
    })
    .join(",");

  return `j.arrayExpression([${items}])`;
}

function buildValue(node) {
  switch (node.type) {
    case "StringLiteral":
      return stringLiteral(node);
    case "NumericLiteral":
      return numericLiteral(node);
    case "BooleanLiteral":
      return booleanLiteral(node);
    case "NullLiteral":
      return nullLiteral();
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
    case "BinaryExpression":
      return binaryExpression(node);
    case "NewExpression":
      return newExpression(node);
    case "LogicalExpression":
      return logicalExpression(node);
    case "ConditionalExpression":
      return conditionalExpression(node);
    case "TemplateLiteral":
      return templateLiteral(node);
    case "ClassExpression":
      return classExpression(node);
    case "UnaryExpression":
      return unaryExpression(node);
    case "AwaitExpression":
      return awaitExpression(node);
    case "FunctionExpression":
      return functionExpression(node);
    case "JSXElement":
      return element(node);
    case "UpdateExpression":
      return updateExpression(node);
    default:
      console.log("ES6::buildValue => ", node.type); // eslint-disable-line
      return "";
  }
}
function buildBlock(body) {
  // Build the jscodeshift api
  let _ast = body.map((node) => {
    switch (node.type) {
      case "VariableDeclaration":
        return variableDeclaration(node);

      case "ImportDeclaration":
        return importDeclaration(node);

      case "ExpressionStatement":
        return expressionStatement(node);

      case "IfStatement":
        return ifStatement(node);

      case "FunctionDeclaration":
        return functionDeclaration(node);

      case "ReturnStatement":
        return returnStatement(node);

      case "BreakStatement":
        return breakStatement();

      case "ThrowStatement":
        return throwStatement(node);

      case "ContinueStatement":
        return continueStatement();

      case "TryStatement":
        return tryStatement(node);

      case "ForOfStatement":
        return forOfStatement(node);

      case "WhileStatement":
        return whileStatement(node);

      default:
        console.log("ES6::buildBlock => ", node.type); // eslint-disable-line
        return "";
    }
  });

  return _ast.join(",");
}

function expressionStatement(node) {
  let { expression } = node;
  let { extra } = expression;
  let str = "";
  switch (expression.type) {
    case "MemberExpression":
      str = memberExpression(expression);
      break;

    case "CallExpression":
      if (extra && extra.parenthesized) {
        str = `j.parenthesizedExpression(
       ${callExpression(expression)}
       )`;
      } else {
        str = callExpression(expression);
      }
      break;

    case "AssignmentExpression":
      str = assignmentExpression(expression);
      break;

    case "Identifier":
      str = identifier(expression);
      break;

    case "BinaryExpression":
      str = binaryExpression(expression);
      break;

    case "YieldExpression":
      str = yieldExpression(expression);
      break;

    case "TemplateLiteral":
      str = templateLiteral(expression);
      break;

    case "TaggedTemplateExpression":
      str = taggedTemplateExpression(expression);
      break;

    case "JSXElement":
      str = element(expression);
      break;

    default:
      console.log("ES6::expressionStatement => ", expression.type); // eslint-disable-line
      break;
  }

  return `j.expressionStatement(${str})`;
}

function arrowFunctionExpression(node) {
  let { params, body } = node;
  let str = "";

  switch (body.type) {
    case "BlockStatement":
      str = `j.arrowFunctionExpression(
      [${buildArgs(params)}],
      j.blockStatement([${buildBlock(body.body)}])
      )`;
      break;

    case "CallExpression":
      str = `j.arrowFunctionExpression(
      [${buildArgs(params)}],
      ${callExpression(body)}
      )`;
      break;

    case "NumericLiteral":
      str = `j.arrowFunctionExpression(
      [${buildArgs(params)}],
      ${numericLiteral(body)}
      )`;
      break;

    case "Identifier":
      str = `j.arrowFunctionExpression(
      [${buildArgs(params)}],
      ${identifier(body)}
      )`;
      break;

    default:
      console.log("ES6::arrowFunctionExpression => ", body.type);
      break;
  }

  return str;
}
function yieldExpression(node) {
  let { argument, delegate } = node;
  return `j.yieldExpression(${buildValue(argument)}, ${delegate})`;
}

function buildArgs(params) {
  let str = params.map((p) => {
    switch (p.type) {
      case "Identifier":
        return identifier(p);

      case "SpreadElement":
        return spreadElement(p);

      case "FunctionExpression":
        return functionExpression(p);

      case "CallExpression":
        return callExpression(p);

      case "MemberExpression":
        return memberExpression(p);

      case "ArrayExpression":
        return arrayExpression(p);

      case "ArrowFunctionExpression":
        return arrowFunctionExpression(p);

      case "RestElement":
        return restElement(p);

      case "UnaryExpression":
        return unaryExpression(p);

      case "ObjectExpression":
        return objectExpression(p);

      case "ThisExpression":
        return `j.thisExpression()`;

      case "StringLiteral":
        return stringLiteral(p);

      case "NumericLiteral":
        return numericLiteral(p);

      case "RegExpLiteral":
        return regExpLiteral(p);

      case "AwaitExpression":
        return awaitExpression(p);

      case "TemplateLiteral":
        return templateLiteral(p);

      case "ObjectPattern":
        return objectPattern(p);
      default:
        console.log("ES6::buildArgs => ", p.type); // eslint-disable-line
        return "";
    }
  });

  return str.join(",");
}

function functionExpression(node) {
  let str = "";
  let { id, body, params } = node;
  if (id) {
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

  if (node.async) {
    str = `(function() {
    var node = ${str};
    node.async = true;
    return node;
    }())`;
  }
  return str;
}

function spreadElement(node) {
  let str = "";
  switch (node.argument.type) {
    case "Identifier":
      str = identifier(node.argument);
      break;

    case "ArrayExpression":
      str = arrayExpression(node.argument);
      break;

    default:
      console.log("ES6::spreadElement => ", node.argument.type);
      break;
  }
  return `j.spreadElement(${str})`;
}

function templateElementValue(value) {
  let _cooked =
    (value && value.cooked && value.cooked.replace("\n", "\\n")) || "";
  let _raw = (value && value.raw && value.raw.replace("\n", "\\n")) || "";
  return `{cooked: "${_cooked}", raw: "${_raw}"}`;
}

function templateElement(node) {
  let str = "";
  let { value, tail } = node;
  str = `j.templateElement(
  ${templateElementValue(value)},
  ${tail}
  )`;
  return str;
}
function templateLiteral(node) {
  let str = "";
  let { expressions, quasis } = node;
  let _expressions = expressions
    .map((e) => {
      switch (e.type) {
        case "Identifier":
          return identifier(e);

        case "CallExpression":
          return callExpression(e);

        case "MemberExpression":
          return memberExpression(e);

        default:
          console.log("ES6::templateLiteral::expressions => ", e.type);
          break;
      }
    })
    .join(",");
  let _quasis = quasis.map((q) => templateElement(q)).join(",");
  str = `j.templateLiteral(
  [${_quasis}],
  [${_expressions}]
  )`;
  return str;
}

function taggedTemplateExpression(node) {
  let { tag, quasi } = node;
  let str = "";
  str = `j.taggedTemplateExpression(
  ${identifier(tag)},
  ${templateLiteral(quasi)}
  )`;
  return str;
}

function decorator(node) {
  let str = "";
  switch (node.type) {
    case "CallExpression":
      str = callExpression(node);
      break;

    case "Identifier":
      str = identifier(node);
      break;

    default:
      console.log("decorator => ", node.type);
      break;
  }
  return `j.decorator(${str})`;
}

function classProperty(node) {
  let str = "";
  let { key, value, decorators } = node;

  if (decorators && decorators.length > 0) {
    str = `(function() {
    var node = j.classProperty(
        ${identifier(key)},
        ${value ? buildValue(value) : null},
        null,
        false
        );

    node.decorators = [${decorators
      .map((d) => decorator(d.expression))
      .join(",")}];
    return node;
    }())`;
  } else {
    str = `j.classProperty(
        ${identifier(key)},
        ${value ? buildValue(value) : null},
        null,
        false
        )`;
  }

  return str;
}
function buildClassBody(body) {
  let str = "";
  str = body
    .map((b) => {
      switch (b.type) {
        case "ClassProperty":
          return classProperty(b);

        case "ClassMethod":
          return `(function() {
        var node = j.classMethod(
          '${b.kind}',
          ${identifier(b.key)},
          [${buildArgs(b.params)}],
          j.blockStatement([${buildBlock(b.body.body)}])
        );
        ${
          b.decorators && b.decorators.length > 0
            ? `node.decorators = [${b.decorators
                .map((d) => decorator(d.expression))
                .join(",")}];`
            : ""
        }
        return node;
        }())`;

        default:
          console.log("ES6::buildClassBody => ", b.type);
          break;
      }
    })
    .join(",");

  return str;
}

function classExpression(node) {
  let str = "";
  let { id, superClass, body } = node;
  let _super = superClass ? identifier(superClass) : null;
  str = `j.classExpression(
    ${id ? identifier(id) : null},
    j.classBody([${buildClassBody(body.body)}]),
    ${_super}
  )`;
  return str;
}

function classDeclaration(node) {
  let str = "";
  let { id, superClass, body, decorators } = node;
  let _super = superClass ? identifier(superClass) : null;
  if (decorators && decorators.length > 0) {
    str = `(function() {
    var node = j.classDeclaration(
    ${identifier(id)},
    j.classBody([${buildClassBody(body.body)}]),
    ${_super}
  );

  node.decorators = [${decorators
    .map((d) => decorator(d.expression))
    .join(",")}]
  return node;

    }())`;
  } else {
    str = `j.classDeclaration(
    ${identifier(id)},
    j.classBody([${buildClassBody(body.body)}]),
    ${_super}
  )`;
  }
  return str;
}

function exportDefaultDeclaration(node) {
  let str = "";
  let { declaration } = node;
  switch (declaration.type) {
    case "FunctionDeclaration":
      str = `j.exportDefaultDeclaration(${functionDeclaration(declaration)})`;
      break;

    case "ClassDeclaration":
      str = `j.exportDefaultDeclaration(${classDeclaration(declaration)})`;
      break;

    case "ObjectExpression":
      str = `j.exportDefaultDeclaration(${objectExpression(declaration)})`;
      break;

    default:
      console.log("ES6::exportDefaultDeclaration =>", declaration.type); // eslint-disable-line
  }

  return str;
}

function exportNamedDeclaration(node) {
  let str = "";
  let { declaration } = node;
  switch (declaration.type) {
    case "FunctionDeclaration":
      str = functionDeclaration(declaration);
      break;

    case "ClassDeclaration":
      str = classDeclaration(declaration);
      break;

    case "ObjectExpression":
      str = objectExpression(declaration);
      break;

    case "VariableDeclaration":
      str = variableDeclaration(declaration);
      break;

    default:
      console.log("ES6::exportNamedDeclaration =>", declaration.type); // eslint-disable-line
  }

  return `j.exportNamedDeclaration(${str})`;
}

function returnStatement(node) {
  let { argument: arg } = node;
  if (!arg) {
    return "j.returnStatement(null)";
  }
  let str = "";
  switch (arg.type) {
    case "CallExpression":
      str = callExpression(arg);
      break;

    case "Identifier":
      str = identifier(arg);
      break;

    case "MemberExpression":
      str = memberExpression(arg);
      break;

    case "BinaryExpression":
      str = binaryExpression(arg);
      break;

    case "ObjectExpression":
      str = objectExpression(arg);
      break;

    case "NewExpression":
      str = newExpression(arg);
      break;

    case "TemplateLiteral":
      str = templateLiteral(arg);
      break;

    case "UpdateExpression":
      str = updateExpression(arg);
      break;

    case "StringLiteral":
      str = stringLiteral(arg);
      break;

    case "BooleanLiteral":
      str = booleanLiteral(arg);
      break;

    case "UnaryExpression":
      str = unaryExpression(arg);
      break;

    case "LogicalExpression":
      str = logicalExpression(arg);
      break;

    case "ConditionalExpression":
      str = conditionalExpression(arg);
      break;

    case "JSXElement":
      str = element(arg);
      break;

    default:
      console.log("ES6::returnStatement => ", arg.type); // eslint-disable-line
      break;
  }

  return `j.returnStatement(${str})`;
}

function callExpression(expression) {
  let { arguments: args, callee } = expression;
  let str = "";
  switch (callee.type) {
    case "MemberExpression":
      str = `j.callExpression(
          ${memberExpression(callee)},
          [${buildArgs(args)}]
        )`;
      break;

    case "Identifier":
      str = `j.callExpression(
          ${identifier(callee)},
          [${buildArgs(args)}]
        )`;
      break;

    case "FunctionExpression":
      str = `j.callExpression(
      ${functionExpression(callee)},
      [${buildArgs(args)}]
      )`;
      break;

    default:
      console.log("ES6::callExpression => ", callee.type);
      break;
  }

  return str;
}

function memberExpression(node) {
  let str = "";
  let { object, property, computed } = node;
  let obj = "";

  // Constructing object of a MemberExpression
  switch (object.type) {
    case "ThisExpression":
      obj = `j.thisExpression()`;
      break;

    case "MemberExpression":
      obj = `${memberExpression(object)}`;
      break;

    case "Identifier":
      obj = identifier(object);
      break;

    case "CallExpression":
      obj = callExpression(object);
      break;

    case "Super":
      obj = `j.super()`;
      break;

    default:
      console.log("ES6::memberExpression.object => ", object.type); // eslint-disable-line
      break;
  }

  let prop = "";
  // Constructing property of a MemberExpression
  switch (property.type) {
    case "Identifier":
      prop = identifier(property);
      break;

    case "CallExpression":
      prop = callExpression(property);
      break;

    case "MemberExpression":
      prop = memberExpression(property);
      break;

    default:
      console.log("memberExpression.property => ", property.type); // eslint-disable-line
      break;
  }

  str = `j.memberExpression(
 ${obj},
 ${prop},
 ${computed}
  )`;
  return str;
}

function restElement(node) {
  let { argument } = node;
  let str = `j.restElement(${identifier(argument)})`;
  return str;
}

function importDefaultSpecifier(node) {
  let { local } = node;
  return `j.importDefaultSpecifier(
    ${identifier(local)}
  )`;
}

function importNamespaceSpecifier(node) {
  let { local } = node;
  return `j.importNamespaceSpecifier(
    ${identifier(local)}
  )`;
}

function importSpecifier(node) {
  let { imported, local } = node;
  return `j.importSpecifier(
  ${identifier(imported)},
    ${identifier(local)}
  )`;
}
function importDeclaration(node) {
  let { source, specifiers } = node;
  let specs = specifiers
    .map((s) => {
      switch (s.type) {
        case "ImportSpecifier":
          return importSpecifier(s);
        case "ImportDefaultSpecifier":
          return importDefaultSpecifier(s);
        case "ImportNamespaceSpecifier":
          return importNamespaceSpecifier(s);
      }
    })
    .join(",");
  let str = `j.importDeclaration(
           [${specs}],
    ${stringLiteral(source)}
                  );`;

  return str;
}

function objectExpression(node) {
  let { properties } = node;
  let str = properties.map((p) => {
    return property(p);
  });
  return `j.objectExpression([${str.join(",")}])`;
}

function property(node) {
  let { key, value, computed, shorthand } = node;
  let str = "";
  switch (node.type) {
    case "ObjectMethod":
      str = `j.objectMethod(
        '${node.kind}',
        ${identifier(key)},
        [],
        j.blockStatement([${buildBlock(node.body.body)}]),
        false
    )`;
      break;

    case "ObjectProperty":
      str = `j.objectProperty(
        ${identifier(key)},
        ${buildValue(value)},
        ${computed},
        ${shorthand}
    )`;
      break;

    case "SpreadElement":
      str = spreadElement(node);
      break;

    case "RestElement":
      str = restElement(node);
      break;

    default:
      console.log("ES6::property => ", node.type);
      break;
  }

  return str;
}

function buildAST(ast, wrapExpression = true) {
  // Build the jscodeshift api
  let _body = ast && ast.program ? ast.program.body : [];
  let _ast = _body.map((node) => {
    switch (node.type) {
      case "VariableDeclaration":
        return wrapExpression
          ? variableDeclaration(node)
          : variableDeclarator(node.declarations[0]);

      case "ImportDeclaration":
        return importDeclaration(node);

      case "ExpressionStatement":
        return wrapExpression
          ? expressionStatement(node)
          : callExpression(node.expression);

      case "IfStatement":
        return ifStatement(node);

      case "ExportDefaultDeclaration":
        return exportDefaultDeclaration(node);

      case "ExportNamedDeclaration":
        return exportNamedDeclaration(node);

      case "EmptyStatement":
        return "j.emptyStatement()";

      case "ClassDeclaration":
        return classDeclaration(node);

      case "FunctionDeclaration":
        return functionDeclaration(node);

      case "ArrowFunctionExpression":
        return arrowFunctionExpression(node);

      case "ReturnStatement":
        return returnStatement(node);

      case "SwitchStatement":
        return switchStatement(node);

      case "TryStatement":
        return tryStatement(node);

      case "ForStatement":
        return forStatement(node);

      case "ForInStatement":
        return forInStatement(node);

      case "ForOfStatement":
        return forOfStatement(node);

      case "BlockStatement":
        return blockStatement(node);

      case "JSXElement":
        return element(node);

      default:
        console.log("buildAST => ", node.type); // eslint-disable-line
        return "";
    }
  });

  return _ast;
}

export {
  buildAST,
  spreadElement,
  templateLiteral,
  taggedTemplateExpression,
  classDeclaration,
  classExpression,
  exportDefaultDeclaration,
  exportNamedDeclaration,
};
