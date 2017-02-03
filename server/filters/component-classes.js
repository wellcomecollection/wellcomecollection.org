export default function componentClasses(componentName, modifiers) {
  const modifierClassNames = Object.keys(modifiers).reduce((acc, key) => {
    return modifiers[key] ? acc.concat(key) : acc;
  }, []).map(modifier => `${componentName}--${modifier}`);

  return [componentName].concat(modifierClassNames).join(' ');
}
