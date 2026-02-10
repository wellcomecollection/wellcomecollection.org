#!/usr/bin/env bash

# Script to export all prototype variants as HTML files
# Usage: ./export-variants.sh [base_url] [output_dir]

set -e

BASE_URL="${1:-http://localhost:3000}"
OUTPUT_DIR="${2:-./exports}"
PROTOTYPE_PATH="/search/prototype-works"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting export of prototype variants...${NC}"
echo "Base URL: $BASE_URL"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Function to export a single variant
export_variant() {
  local variant_name=$1
  local output_file="$OUTPUT_DIR/${variant_name}.html"
  local url="${BASE_URL}${PROTOTYPE_PATH}?variant=${variant_name}"
  
  echo -e "${BLUE}Exporting ${variant_name}...${NC}"
  
  # Use curl to fetch the page
  if curl -s "$url" > "$output_file"; then
    # Check if the file contains actual content (not just an error page)
    if grep -q "PROTOTYPE MODE" "$output_file"; then
      # Fix the display:none issue for static HTML viewing
      sed -i '' 's/<style data-next-hide-fouc="true">body{display:none}<\/style><noscript data-next-hide-fouc="true"><style>body{display:block}<\/style><\/noscript>/<style data-next-hide-fouc="true">body{display:block}<\/style>/g' "$output_file"
      echo -e "${GREEN}✓ Exported ${variant_name} to ${output_file}${NC}"
    else
      echo "✗ Failed to export ${variant_name} - check if variant exists"
      rm "$output_file"
      return 1
    fi
  else
    echo "✗ Failed to fetch ${variant_name}"
    return 1
  fi
}

# Check if we can reach the server
if ! curl -s -f "${BASE_URL}${PROTOTYPE_PATH}" > /dev/null; then
  echo "Error: Cannot reach ${BASE_URL}${PROTOTYPE_PATH}"
  echo "Make sure your dev server is running with: yarn content"
  exit 1
fi

# Find all JSON files in the variants directory and export them
VARIANTS_DIR="./variants"
if [ ! -d "$VARIANTS_DIR" ]; then
  echo "Error: variants directory not found at $VARIANTS_DIR"
  exit 1
fi

# Loop through all JSON files in the variants directory
for variant_file in "$VARIANTS_DIR"/*.json; do
  # Extract filename without path and extension
  variant_name=$(basename "$variant_file" .json)
  export_variant "$variant_name" || true
done

echo ""
echo -e "${GREEN}Export complete!${NC}"
echo "HTML files saved to: $OUTPUT_DIR"
echo ""
echo "To share these files:"
echo "1. Open any .html file in a browser"
echo "2. Links will open the real works on wellcomecollection.org"
echo "3. Requires internet connection to load styles and images"
