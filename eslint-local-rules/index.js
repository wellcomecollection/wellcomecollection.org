// Check if components have a data-component attribute
// This was written by Copilot following my instructions.
// Gareth and I agreed that because it was a nice to have, if it caused issues we could always remove it.
module.exports = {
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
      },
    },

    create(context) {
      const filename = context.getFilename();

      // Only run on index.tsx or index.ts in any subfolder of /components/ (recursively)
      // Ignore files in /components/styled
      if (!/\/components\/(?!styled\/)(.+\/)*index\.tsx?$/.test(filename)) {
        return {};
      }
      let found = false;
      let intentionallyOmitted = false;

      function isKebabCase(str) {
        return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
      }

      return {
        Program(node) {
          const sourceCode = context.getSourceCode();
          const comments = sourceCode.getAllComments();
          intentionallyOmitted = comments.some(comment =>
            /eslint-data-component:\s*intentionally omitted/i.test(
              comment.value
            )
          );
        },
        JSXElement(node) {
          if (found) return;
          if (node.openingElement && node.openingElement.attributes) {
            const attr = node.openingElement.attributes.find(
              a =>
                a.type === 'JSXAttribute' &&
                a.name &&
                a.name.name === 'data-component'
            );
            if (attr && attr.value && attr.value.type === 'Literal') {
              if (isKebabCase(attr.value.value)) {
                found = true;
              }
            }
          }
        },
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
