# Custom ESLint Rules for Wellcome Collection

This directory contains custom ESLint rules specific to the Wellcome Collection project.

## Rules

### `require-data-component`

**What it does**: Enforces that all React components in the `/content/webapp/views/components/` directory have a `data-component` attribute with the correct kebab-case value.

**Why it's useful**: 
- Enables consistent GTM (Google Tag Manager) targeting across all components
- Automatically detects missing or incorrect `data-component` attributes
- Reduces manual intervention needed for tracking implementation

**Examples**:

✅ **Good**:
```tsx
const AudioPlayer: FunctionComponent<Props> = ({ audioFile }) => (
  <div data-component="audio-player">
    {/* component content */}
  </div>
);
```

❌ **Bad**:
```tsx
// Missing data-component attribute
const AudioPlayer: FunctionComponent<Props> = ({ audioFile }) => (
  <div>
    {/* component content */}
  </div>
);

// Incorrect attribute value (should be kebab-case)
const AudioPlayer: FunctionComponent<Props> = ({ audioFile }) => (
  <div data-component="AudioPlayer">
    {/* component content */}
  </div>
);
```

**Rule behavior**:
- Only applies to `index.tsx` files in `/content/webapp/views/components/*/` directories
- Automatically determines the expected kebab-case name from the directory name
- Detects React function components and arrow function components
- Reports errors for missing, incorrect, or malformed `data-component` attributes
- Suggests wrapping React Fragments in divs with the appropriate attribute

**Configuration**: The rule is enabled as an error for component files in `.eslintrc.js`.