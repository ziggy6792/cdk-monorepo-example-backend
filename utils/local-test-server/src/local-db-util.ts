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
import LOCAL_STACK_CONFIG from './config';

// AWS.config.update(TEST_DB_CONFIG);

const exec = util.promisify(child.exec);

let localDb: child.ChildProcessWithoutNullStreams;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const promiseWithTimeout = function (promise: Promise<any>, ms: number) {
    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`Timed out in ${ms}ms.`));
        }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout]);
};

// export const checkConnection = async (): Promise<boolean> => {
//     const dynamodb = new AWS.DynamoDB();
//     const tables = await promiseWithTimeout(dynamodb.listTables().promise(), 1000);
//     console.log('LOCAL TEST ENV: READY');

//     return true;
// };

export const checkConnection = async (): Promise<boolean> => {
    const response = await axios.get(LOCAL_STACK_CONFIG.checkHealthEndpoint, { timeout: 1000 });
    const ready = _.isEqual(response.data, LOCAL_STACK_CONFIG.readyResponse);
    if (!ready) {
        console.log('expected', JSON.stringify(LOCAL_STACK_CONFIG.readyResponse));
        console.log('');
        console.log('actual', JSON.stringify(response.data));

        throw new Error('Not ready');
    }
    return ready;
};

export const isBootstraped = async (): Promise<boolean> => {
    const client = new AWS.S3();
    try {
        const response = await client.listBuckets().promise();
        console.log('response', response);
    } catch (err) {
        console.log({ err });
    }

    return true;
};

const startLocalServer = async (): Promise<void> => {
    console.log('LOCAL TEST ENV: START');

    localDb = child.spawn('yarn', ['start:localstack']);

    localDb.stdout.on('data', (data) => {
        console.log(`localstack: ${data.toString()}`);
    });

    localDb.stderr.on('data', (data) => {
        console.log(`localstack: ${data.toString()}`);
    });

    localDb.on('exit', (code) => {
        console.log(`child process exited with code ${code?.toString()}`);
    });

    try {
        await poll({
            taskFn: checkConnection,
            interval: 1000,
            retries: 60,
        });
    } catch (err) {
        console.log('LOCAL TEST ENV: Could not connect');
        throw new Error('LOCAL TEST ENV: Could not connect');
    }
};

const deployLocalTestStack = (): Promise<void> => {
    console.log('LOCAL TEST ENV: deploying local test stack');

    return new Promise((resolve, reject) => {
        const deployLocalTestStack = child.spawn('yarn', ['cdk:app:deploy:local:test:stack']);

        deployLocalTestStack.stdout.on('data', (data) => {
            console.log(`deploy:local:test:stack: ${data.toString()}`);
        });

        deployLocalTestStack.stderr.on('data', (data) => {
            console.log(`deploy:local:test:stack: ${data.toString()}`);
        });

        deployLocalTestStack.on('exit', (code) => {
            console.log(`deploy:local:test:stack: child process exited with code ${code?.toString()}`);
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`child process exited with code ${code?.toString()}`));
            }
        });
    });
};

const bootstrap = (): Promise<void> => {
    console.log('LOCAL TEST ENV: bootstrapping local test stack');

    return new Promise((resolve, reject) => {
        const deployLocalTestStack = child.spawn('yarn', ['cdk:app:local:test:env:bootstrap']);

        deployLocalTestStack.stdout.on('data', (data) => {
            console.log(`local:test:env:bootstrap: ${data.toString()}`);
        });

        deployLocalTestStack.stderr.on('data', (data) => {
            console.log(`local:test:env:bootstrap: ${data.toString()}`);
        });

        deployLocalTestStack.on('exit', (code) => {
            console.log(`local:test:env:bootstrap: child process exited with code ${code?.toString()}`);
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`child process exited with code ${code?.toString()}`));
            }
        });
    });
};

interface IArgs {
    _: string[];
    isSkipBootstrap: boolean;
}

export const start = async (): Promise<void> => {
    console.log('\n\nLOCAL TEST ENV: INIT');

    const args = (yargs(hideBin(process.argv)).argv as unknown) as IArgs;

    console.log('Recieved Args', args);

    // do app specific cleaning before exiting
    process.on('SIGINT', () => {
        console.log('Got SIGINT.  Press Control-C to exit.');
    });

    let isLocalDbRunning = false;

    try {
        isLocalDbRunning = await checkConnection();
    } catch (err) {
        // Do nothing - must be is it not running
    }

    if (!isLocalDbRunning) {
        // Start local TEST ENV
        await startLocalServer();
        console.log('READYY!!!!!');
    }

    if (!args.isSkipBootstrap) {
        await bootstrap();
    }

    await deployLocalTestStack();
};

export const stop = (): void => {
    console.log('\n\nLOCAL TEST ENV: STOP');

    kill(localDb.pid);
};
