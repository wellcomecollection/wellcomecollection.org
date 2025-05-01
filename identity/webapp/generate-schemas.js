const { writeFileSync, readdirSync } = require('fs');
const { resolve, join } = require('path');
const TJS = require('typescript-json-schema');

const files = readdirSync(join(__dirname, './types/schemas')).map(f =>
  join(__dirname, './types/schemas', f)
);

const program = TJS.getProgramFromFiles(files, {
  baseUrl: './types/schemas',
  skipLibCheck: true,
});

const generator = TJS.buildGenerator(program, {});

const symbols = generator.getMainFileSymbols(program, files);

for (const typeName of symbols) {
  console.log('starting... ', typeName);
  const schema = TJS.generateSchema(program, typeName, {
    required: true,
    noExtraProps: false,
  });
  if (schema) {
    writeFileSync(
      join(resolve(__dirname, 'schemas'), `${typeName}.json`),
      JSON.stringify(schema, null, 2)
    );
  }
}
