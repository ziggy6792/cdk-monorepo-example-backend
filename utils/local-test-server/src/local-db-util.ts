/* eslint-disable import/no-extraneous-dependencies */
import * as child from 'child_process';
import kill from 'tree-kill';
import poll from 'promise-poller';
import util from 'util';
import AWS from 'aws-sdk';
import TEST_DB_CONFIG from './config';

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

export const checkConnection = async (): Promise<boolean> => {
    const dynamodb = new AWS.DynamoDB(TEST_DB_CONFIG);
    const tables = await dynamodb.listTables().promise();
    console.log('LOCAL DB: READY');

    return true;
};

const deployLocalTestStack = (): Promise<boolean> =>
    new Promise((resolve, reject) => {
        const deployLocalTestStack = child.spawn('yarn', ['cdk:app:deploy:local:test:stack']);

        deployLocalTestStack.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        deployLocalTestStack.stderr.on('data', (data) => {
            console.log(`stderr: ${data.toString()}`);
        });

        deployLocalTestStack.on('exit', (code) => {
            console.log(`child process exited with code ${code.toString()}`);
            if (code === 0) {
                resolve(true);
            } else {
                reject(new Error(`child process exited with code ${code.toString()}`));
            }
        });
    });

export const start = async (): Promise<void> => {
    console.log('\n\nLOCAL DB: INIT');

    let isLocalDbRunning = false;

    try {
        isLocalDbRunning = await checkConnection();
    } catch (err) {
        // Do nothing - must be is it not running
    }

    if (!isLocalDbRunning) {
        // Start local db
        console.log('LOCAL DB: START');

        localDb = child.spawn('yarn', ['start:localstack']);

        localDb.stdout.on('data', (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        localDb.stderr.on('data', (data) => {
            console.log(`stderr: ${data.toString()}`);
        });

        localDb.on('exit', (code) => {
            console.log(`child process exited with code ${code.toString()}`);
        });

        try {
            await poll({
                taskFn: checkConnection,
                interval: 100,
                retries: 200,
            });
        } catch (err) {
            console.log('LOCAL DB: Could not connect');
            throw new Error('LOCAL DB: Could not connect');
        }
    }

    console.log('LOCAL DB: deploying tables');

    await deployLocalTestStack();
};

export const stop = (): void => {
    console.log('\n\nLOCAL DB: STOP');

    kill(localDb.pid);
};
