/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);
const base = require('../../jest.config.base.js');
const package = require('./package.json');

module.exports = {
    ...base,
    name: package.name,
    displayName: package.name,
    roots: ['<rootDir>/src'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleNameMapper,
    setupFilesAfterEnv: ['./src/test-utils/setup-after-env.ts'],
};
