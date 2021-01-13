/* eslint-disable @typescript-eslint/no-var-requires */
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

const base = require('./jest.config.base.js');

module.exports = {
  ...base,
  // projects: [project('all', ['<rootDir>/packages/**/*.test.ts'])],
  roots: [],
  projects: ['<rootDir>/packages/*/jest.config.js'],
};
