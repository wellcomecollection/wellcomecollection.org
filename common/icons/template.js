function template(
  { componentName, jsx, exports, interfaces, props, svgProps },
  { tpl }
) {
  const comment = `// This is autogenerated from an SVG file
// Do not edit this file directly; edit the SVG file and run "yarn run-svgr"
  `;

  return tpl`
    ${comment}

    import { SVGProps } from 'react';
    ${interfaces}

    function ${componentName}(${props}) {
      return ${jsx};
    }

    ${exports}
  `;
}
module.exports = template;
