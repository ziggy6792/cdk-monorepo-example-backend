/* eslint-disable @typescript-eslint/no-var-requires */

const base = require('./jest.config.base.js');

function project(displayName, testMatch) {
  return {
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    moduleNameMapper: {},

    displayName,
    testMatch,
    collectCoverageFrom: [
      'packages/**/*.ts',
      '!**/dist/**',
      '!**/node_modules/**',
      '!**/build/**',
      '!**/stack.ts',
      '!**/cdk.out/**',
      '!**/test/**',
      '!**/node_modules/**',
      '!**/coverage/**',
    ],
    coveragePathIgnorePatterns: ['/node_modules/', '/build/', '/dist/', '/coverage/'],
    transformIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
    watchPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/', '/coverage/'],
    coverageProvider: 'v8',
  };
}

module.exports = {
  ...base,
  globalSetup: './utils/local-test-server/global-setup.ts',
  globalTeardown: './utils/local-test-server/global-teardown.ts',
  projects: ['<rootDir>/packages/*/jest.config.js'],
};
