// ESLint custom rule: Enforce kebab-case data-component attribute in /components/*/index.tsx files
// ---------------------------------------------------------------------------------------------
// This rule was written by Copilot following user instructions.
// Gareth and Raph agreed that because it was a nice to have, if it caused issues we could always remove it.
//
// Rule summary:
//   - Requires at least one JSX element in each /components/**/index.tsx (or .ts) file to have a kebab-case data-component attribute.
//   - Ignores files in /components/styled.
//   - Allows opt-out with a comment: // eslint-data-component: intentionally omitted
//   - Warns if the data-component value is not kebab-case.
//   - Only checks files matching the recursive /components/ path pattern.

module.exports = {
  // Rule name: data-component-declared
  'data-component-declared': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Require data-component attribute on root JSX of default export in index files, unless intentionally omitted',
        category: 'Best Practices',
        recommended: true,
      },
      fixable: 'code',
      schema: [],
      messages: {
        intentionallyOmitted: 'data-component attribute intentionally omitted.',
        notKebabCase:
          'data-component value "{{actualValue}}" is not kebab-case. Use kebab-case (e.g., my-component).',
      },
    },

    create(context) {
      const filename = context.getFilename();

      // Regex explanation:
      //   - /components/ : must be in a components folder
      //   - (?!styled/)  : negative lookahead to skip styled subfolder
      //   - (?:[^/]+/)*  : match any subfolder(s) recursively
      //   - index.tsx?   : must be index.tsx or index.ts
      if (
        !/\/components\/(?!styled\/)(?:[^/]+\/)*index\.tsx?$/.test(filename)
      ) {
        // Not a target file, do nothing
        return {};
      }
      let found = false; // Tracks if a valid data-component was found
      let intentionallyOmitted = false; // Tracks if opt-out comment is present

      // Helper: Check if a string is kebab-case
      function isKebabCase(str) {
        return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
      }

      return {
        // On program start, check for opt-out comment
        Program(node) {
          const sourceCode = context.getSourceCode();
          const comments = sourceCode.getAllComments();
          intentionallyOmitted = comments.some(comment =>
            /eslint-data-component:\s*intentionally omitted/i.test(
              comment.value
            )
          );
        },
        // Visit each JSX element, look for data-component attribute
        JSXElement(node) {
          if (found) return; // Only need to find one valid or invalid occurrence
          if (node.openingElement && node.openingElement.attributes) {
            const attr = node.openingElement.attributes.find(
              a =>
                a.type === 'JSXAttribute' &&
                a.name &&
                a.name.name === 'data-component'
            );
            if (attr && attr.value && attr.value.type === 'Literal') {
              if (isKebabCase(attr.value.value)) {
                found = true; // Valid kebab-case found
              } else {
                // Found, but not kebab-case: warn and stop further checks
                context.report({
                  node: attr,
                  messageId: 'notKebabCase',
                  data: { actualValue: attr.value.value },
                });
                found = true; // Prevent duplicate errors for the same file
              }
            }
          }
        },
        // On program exit, if no valid data-component and not opted out, report error
        'Program:exit'() {
          if (intentionallyOmitted) return;
          if (!found) {
            context.report({
              loc: { line: 1, column: 0 },
              message:
                'At least one JSX element must have a kebab-case data-component attribute.',
            });
          }
        },
      };
    },
  },
};
