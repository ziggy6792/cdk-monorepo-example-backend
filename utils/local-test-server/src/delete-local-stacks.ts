/* eslint-disable import/no-extraneous-dependencies */
import * as child from 'child_process';
import kill from 'tree-kill';
import poll from 'promise-poller';
import util from 'util';
import AWS from 'aws-sdk';
// import TEST_DB_CONFIG from './config';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import axios from 'axios';
import _ from 'lodash';
import { TEST_DB_CONFIG } from './config';

AWS.config.update(TEST_DB_CONFIG);

const delteAllStacks = async () => {
    const cloudFormation = new AWS.CloudFormation();
    const result = await cloudFormation.listStacks({ StackStatusFilter: ['UPDATE_COMPLETE'] }).promise();

    const deleteFns = result.StackSummaries.map((summary) => async () => cloudFormation.deleteStack({ StackName: summary.StackName }).promise());

    await Promise.all(deleteFns.map((fn) => fn()));
    // result.
    console.log('result', result);
};

delteAllStacks()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
