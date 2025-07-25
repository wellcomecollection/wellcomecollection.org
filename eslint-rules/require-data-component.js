const path = require('path');

/**
 * Converts PascalCase component names to kebab-case
 * @param {string} componentName - The component name in PascalCase
 * @returns {string} The component name in kebab-case
 */
function toKebabCase(componentName) {
  return componentName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Checks if a file is a React component in the components directory
 * @param {string} filename - The file path
 * @returns {boolean} True if the file is a component that should have data-component
 */
function isComponentFile(filename) {
  const normalizedPath = path.normalize(filename);
  return (
    normalizedPath.includes('/content/webapp/views/components/') &&
    normalizedPath.endsWith('/index.tsx')
  );
}

/**
 * Gets the component name from the file path
 * @param {string} filename - The file path
 * @returns {string|null} The component name or null if not found
 */
function getComponentNameFromPath(filename) {
  const normalizedPath = path.normalize(filename);
  const match = normalizedPath.match(
    /\/content\/webapp\/views\/components\/([^/]+)\/index\.tsx$/
  );
  return match ? match[1] : null;
}

/**
 * Checks if JSX element has data-component attribute
 * @param {Object} node - The JSX element node
 * @returns {Object|null} The data-component attribute node or null
 */
function hasDataComponentAttribute(node) {
  if (!node.openingElement || !node.openingElement.attributes) {
    return null;
  }

  return node.openingElement.attributes.find(attr => {
    return (
      attr.type === 'JSXAttribute' &&
      attr.name &&
      attr.name.name === 'data-component'
    );
  });
}

/**
 * Gets the value of data-component attribute
 * @param {Object} attr - The data-component attribute node
 * @returns {string|null} The attribute value or null
 */
function getDataComponentValue(attr) {
  if (!attr || !attr.value) return null;
  if (attr.value.type === 'Literal') {
    return attr.value.value;
  }
  if (
    attr.value.type === 'JSXExpressionContainer' &&
    attr.value.expression.type === 'Literal'
  ) {
    return attr.value.expression.value;
  }
  return null;
}

/**
 * Finds the root JSX element in a component
 * @param {Object} node - The function/component node
 * @returns {Object|null} The root JSX element or null
 */
function findRootJSXElement(node) {
  let body = null;

  // Handle different function types
  if (node.type === 'FunctionDeclaration') {
    body = node.body;
  } else if (
    node.type === 'VariableDeclarator' &&
    node.init &&
    (node.init.type === 'ArrowFunctionExpression' ||
      node.init.type === 'FunctionExpression')
  ) {
    body = node.init.body;
  } else if (
    node.type === 'ArrowFunctionExpression' ||
    node.type === 'FunctionExpression'
  ) {
    body = node.body;
  }

  if (!body) return null;

  // Handle direct JSX return (arrow function without braces)
  if (body.type === 'JSXElement' || body.type === 'JSXFragment') {
    return body.type === 'JSXElement' ? body : null;
  }

  // Handle block statement
  if (body.type === 'BlockStatement') {
    // Look for return statements
    for (const statement of body.body) {
      if (statement.type === 'ReturnStatement' && statement.argument) {
        if (statement.argument.type === 'JSXElement') {
          return statement.argument;
        }
        // Handle parenthesized expressions
        if (statement.argument.type === 'JSXFragment') {
          return null; // Fragments need wrapping
        }
      }
    }
  }

  return null;
}

/**
 * Checks if a node represents a React component
 * @param {Object} node - The AST node to check
 * @returns {boolean} True if the node is a React component
 */
function isReactComponent(node) {
  // Check function declarations
  if (
    node.type === 'FunctionDeclaration' &&
    node.id &&
    /^[A-Z]/.test(node.id.name)
  ) {
    return true;
  }

  // Check variable declarations with arrow functions or function expressions
  if (
    node.type === 'VariableDeclarator' &&
    node.id &&
    node.id.name &&
    /^[A-Z]/.test(node.id.name) &&
    node.init &&
    (node.init.type === 'ArrowFunctionExpression' ||
      node.init.type === 'FunctionExpression')
  ) {
    return true;
  }

  return false;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require data-component attributes on React components in the components directory',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null, // Disable auto-fix for now
    schema: [],
    messages: {
      missingDataComponent:
        'Component "{{componentName}}" should have a data-component="{{expectedValue}}" attribute on its root element.',
      incorrectDataComponent:
        'Component "{{componentName}}" has incorrect data-component value "{{actualValue}}". Expected "{{expectedValue}}".',
      fragmentNeedsWrapper:
        'Component "{{componentName}}" returns a Fragment. Wrap it in a div with data-component="{{expectedValue}}" attribute.',
    },
  },

  create(context) {
    const filename = context.getFilename();

    // Only run this rule on component files
    if (!isComponentFile(filename)) {
      return {};
    }

    const componentNameFromPath = getComponentNameFromPath(filename);
    if (!componentNameFromPath) {
      return {};
    }

    const expectedDataComponent = toKebabCase(componentNameFromPath);

    return {
      Program(node) {
        // Find React components in the file
        const components = [];

        // Look for function declarations and variable declarators
        node.body.forEach(statement => {
          if (
            statement.type === 'FunctionDeclaration' &&
            isReactComponent(statement)
          ) {
            components.push(statement);
          } else if (statement.type === 'VariableDeclaration') {
            statement.declarations.forEach(declarator => {
              if (isReactComponent(declarator)) {
                components.push(declarator);
              }
            });
          } else if (statement.type === 'ExportDefaultDeclaration') {
            if (
              statement.declaration &&
              isReactComponent(statement.declaration)
            ) {
              components.push(statement.declaration);
            }
          }
        });

        // Also look for exported components
        node.body.forEach(statement => {
          if (
            statement.type === 'ExportNamedDeclaration' &&
            statement.declaration
          ) {
            if (
              statement.declaration.type === 'FunctionDeclaration' &&
              isReactComponent(statement.declaration)
            ) {
              components.push(statement.declaration);
            } else if (statement.declaration.type === 'VariableDeclaration') {
              statement.declaration.declarations.forEach(declarator => {
                if (isReactComponent(declarator)) {
                  components.push(declarator);
                }
              });
            }
          }
        });

        // Check each component
        components.forEach(component => {
          const rootElement = findRootJSXElement(component);

          if (!rootElement) {
            // Check if it's returning a fragment
            let body = component.body;
            if (component.type === 'VariableDeclarator' && component.init) {
              body = component.init.body;
            }

            if (body && body.type === 'BlockStatement') {
              const returnStatement = body.body.find(
                stmt => stmt.type === 'ReturnStatement'
              );
              if (
                returnStatement &&
                returnStatement.argument &&
                returnStatement.argument.type === 'JSXFragment'
              ) {
                context.report({
                  node: returnStatement.argument,
                  messageId: 'fragmentNeedsWrapper',
                  data: {
                    componentName: componentNameFromPath,
                    expectedValue: expectedDataComponent,
                  },
                });
              }
            }
            return;
          }

          const dataComponentAttr = hasDataComponentAttribute(rootElement);

          if (!dataComponentAttr) {
            context.report({
              node: rootElement.openingElement,
              messageId: 'missingDataComponent',
              data: {
                componentName: componentNameFromPath,
                expectedValue: expectedDataComponent,
              },
            });
          } else {
            const actualValue = getDataComponentValue(dataComponentAttr);
            if (actualValue !== expectedDataComponent) {
              context.report({
                node: dataComponentAttr,
                messageId: 'incorrectDataComponent',
                data: {
                  componentName: componentNameFromPath,
                  actualValue: actualValue || 'undefined',
                  expectedValue: expectedDataComponent,
                },
                fix(fixer) {
                  return fixer.replaceText(
                    dataComponentAttr.value,
                    `"${expectedDataComponent}"`
                  );
                },
              });
            }
          }
        });
      },
    };
  },
};
