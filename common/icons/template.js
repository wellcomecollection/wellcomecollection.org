function template(
  { template },
  opts,
  { imports, componentName, props, jsx, exports }
) {
  return template.ast`
    const ${componentName} = (${props}) => ${jsx}
    ${exports}
  `;
}
module.exports = template;
