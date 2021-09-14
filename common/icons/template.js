function template(
  { template },
  opts,
  { componentName, jsx, exports, interfaces, props }
) {
  const tpl = template.smart({ plugins: ['typescript'] });

  // This has to be added manually to the AST
  // See https://github.com/babel/babel/issues/10636
  componentName.typeAnnotation = {
    type: 'TSTypeAnnotation',
    typeAnnotation: {
      type: 'TSTypeReference',
      typeName: {
        type: 'Identifier',
        name: 'FunctionComponent',
      },
      typeParameters: {
        type: 'TSTypeParameterInstantiation',
        params: [
          {
            type: 'TSTypeReference',
            typeName: {
              type: 'Identifier',
              name: 'Props',
            },
          },
        ],
      },
    },
  };

  return tpl.ast`
    import { SVGProps, FunctionComponent } from 'react';
    ${interfaces}
    type Props = SVGProps<SVGSVGElement>;

    const ${componentName} = (props) => ${jsx}

    ${exports}
  `;
}
module.exports = template;
