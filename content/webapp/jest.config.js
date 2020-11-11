module.exports = {
  setupFilesAfterEnv: ['@weco/common/test/setupTests.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transformIgnorePatterns: ['node_modules(?!/@weco(?!.*node_modules))'],
};
