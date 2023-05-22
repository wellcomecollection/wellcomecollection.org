module.exports = {
  "extends": [
    "stylelint-config-standard"
  ],
  "customSyntax": "postcss-styled-syntax",
  "rules": {
    "no-empty-source": null,
    "declaration-empty-line-before": null,
    "alpha-value-notation": "number",
    "selector-class-pattern": null,
    "declaration-block-no-redundant-longhand-properties": [
      true, 
      { "ignoreShorthands": ["inset"]}
    ],
    "color-function-notation": "legacy",
    "media-feature-range-notation": "prefix",
    "value-keyword-case": [
      "lower",
      {
          "camelCaseSvgKeywords": true
      }
    ],
    "font-family-name-quotes": "always-unless-keyword",
    "declaration-property-value-no-unknown": true
  }
}