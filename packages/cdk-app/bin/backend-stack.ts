#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { PROJECT_NAME } from '../conf';
import { PackagesStack } from '../lib/packages-stack';

const app = new cdk.App();
const stack = new PackagesStack(app, PROJECT_NAME);
