#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { PackagesStack } from '../lib/packages-stack';

const app = new cdk.App();
new PackagesStack(app, 'PackagesStack');
