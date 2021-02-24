module.exports = {
  transformIgnorePatterns: ['node_modules(?!/@weco(?!.*node_modules))'],
  setupFilesAfterEnv: [
    '@weco/common/test/setupTests.js',
    '<rootDir>/jest.setup.ts',
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
