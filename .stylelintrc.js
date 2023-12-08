module.exports = {
  "extends": [
    "stylelint-config-standard"
  ],
  "customSyntax": "postcss-styled-syntax",
  "rules": {
    "alpha-value-notation": "number",
    "color-function-notation": "legacy",
    "declaration-block-no-redundant-longhand-properties": [
      true, 
      { "ignoreShorthands": ["inset"]}
    ],
    "declaration-empty-line-before": null,
    "declaration-property-value-no-unknown": true,
    "font-family-name-quotes": "always-unless-keyword",
    "media-feature-range-notation": "prefix",
    "no-empty-source": null,
    "property-no-vendor-prefix": null,
    "selector-class-pattern": null,
    "value-keyword-case": [
      "lower",
      { "camelCaseSvgKeywords": true }
    ]
  }
}