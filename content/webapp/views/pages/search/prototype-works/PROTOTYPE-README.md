# Search Results Prototype - Batch Export

This prototype allows you to create multiple search result pages with hardcoded data for user testing, and export them all as HTML files automatically.

## Quick Start for 30 Variants

### 1. Add Your JSON Files

Place all your variant JSON files in the `/variants` directory, in the format `modelName_hyphenated-query-string.json`

Each file should contain an array of Work objects from the API.

### 2. Generate Import Code

Run the helper script to generate the import code:

```bash
cd content/webapp/views/pages/search/prototype-works
node generate-imports.js
```

This will output code to copy into [index.tsx](index.tsx) in the `variantFiles` object.

### 3. Update index.tsx

Open [index.tsx](index.tsx) and replace the `variantFiles` object with the generated code:

```typescript
const variantFiles: Record<string, Work[]> = {
  variant_1: require('./variants/variant_1.json'),
  variant_2: require('./variants/variant_2.json'),
  // ... all variants
};
```


### 4. Start Your Dev Server

```bash
# From the root of the project
yarn content
```

### 5. Test Individual Variants

Visit in your browser to test, eg.:
- `http://localhost:3000/search/prototype-works?variant=modelName_hyphenated-query-string`
- etc.

### 6. Export All HTML Files

Once you're happy with the variants, run the export script:

```bash
cd content/webapp/views/pages/search/prototype-works
./export-variants.sh
```

This will create an `exports/` directory with all HTML files, eg.:
- `modelName_hyphenated-query-string.html`


**Note:** The dev server must be running for the export to work!

## Advanced Usage

### Custom Export Location

```bash
./export-variants.sh http://localhost:3000 /path/to/output
```

### Export Specific Range

Edit `export-variants.sh` and change the loop:

```bash
# Export only variants 1-10
for i in {1..10}; do
  export_variant "variant_${i}" || true
done
```

## Sharing the HTML Files

The exported HTML files:
- ✅ Can be opened directly in a browser
- ✅ Work result links point to `https://wellcomecollection.org/works/{id}`
- ✅ Links open in new tabs
- ⚠️ **Require internet connection** (loads CSS, fonts, images from CDN)
- ⚠️ Filters and sorting don't work (by design - static prototype)

### Distribution Options

1. **Email**: Zip the exports folder and send
2. **Cloud Storage**: Upload to Google Drive, Dropbox, etc.
3. **Web Hosting**: Upload to any static hosting (GitHub Pages, Netlify, etc.)


## Getting Real API Data

To capture real API responses:

1. Visit: `https://wellcomecollection.org/search/works?query=cancer`
2. Open DevTools → Network tab
3. Find the API call to `/catalogue/v2/works`
4. Copy the response JSON → save as `variant_X.json`

Or use the includes to get full Work data:

```
https://api.wellcomecollection.org/catalogue/v2/works?query=cancer&include=identifiers,images,items,subjects,genres,contributors,production,notes,formerFrequency,designation,parts,partOf,languages,holdings
```
