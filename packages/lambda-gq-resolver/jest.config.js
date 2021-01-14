/* eslint-disable @typescript-eslint/no-var-requires */
const base = require('../../jest.config.base.js');
const package = require('./package.json');

module.exports = {
  ...base,
  name: package.name,
  displayName: package.name,
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  globalSetup: './src/test-utils/setup.ts',
  // setupFilesAfterEnv: ['./src/test-utils/setup-after-env.ts'],
};
