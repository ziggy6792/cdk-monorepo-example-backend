#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cdk = tslib_1.__importStar(require("@aws-cdk/core"));
const packages_stack_1 = require("../lib/packages-stack");
const app = new cdk.App();
new packages_stack_1.PackagesStack(app, 'PackagesStack');
//# sourceMappingURL=packages.js.map