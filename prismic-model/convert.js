const modelName = process.argv[2];
const model = require(`./js/${modelName}`);

console.info(model);
