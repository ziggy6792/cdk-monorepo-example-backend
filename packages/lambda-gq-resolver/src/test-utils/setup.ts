/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import sync from 'sync';
import * as child from 'child_process';
import clearDb from './clear-db';

const deasync = require('deasync');

export default async (): Promise<void> => {
    const cp = require('child_process');
    const exec = deasync(child.exec);

    // console.log(process.env);

    // // output result of ls -la
    try {
        console.log('start setup');
        console.log(exec(`cd "${__dirname}" && yarn test:setup`));
        console.log('end setup');

        // child.execSync(`yarn ts-node ${__dirname}/run-setup.ts`);
    } catch (err) {
        console.log(err);
    }

    // console.log('done');

    /*
    delayWithCb(10000, () => console.log('DONE!'));

    const delaySync = deasync(delayWithCb);

    try {
        console.log(delaySync(3000));
    } catch (err) {
        console.log(err);
    }
    */

    // console.log('start');
    // awaitPromise(delay(3000));
    // console.log('end');

    // let ret;
    // setTimeout(() => {
    //     ret = 'hello';
    // }, 3000);
    // while (ret === undefined) {
    //     require('deasync').sleep(100);
    // }
    // // returns hello with sleep; undefined without
    // return ret;

    // sync(delay(10000));
    // let flag = false;
    // const fn = async () => {
    //     console.log('started!!!!!');

    //     await delay(10000);
    //     flag = true;
    //     console.log('done!!!!!');
    // };
    // fn();
    // while (!flag) {
    //     require('deasync').sleep(1000);
    //     console.log('waiting');
    // }

    // let ret;
    // setTimeout(() => {
    //     ret = 'hello';
    // }, 3000);

    // console.log('start');

    // const syncDelay = deasync(() => delay(3000));

    // syncDelay();

    // console.log('end');

    // delay(3000).then(() => {
    //     ret = 'hello';
    // });

    // while (ret === undefined) {
    //     console.log('waiting');

    //     require('deasync').sleep(100);
    // }

    // let done = false;
    // let data;
    // delay(3000).then((res) => {
    //     data = res;
    //     done = true;
    // });
    // require('deasync').loopWhile(() => !done);
    // console.log('timer done');
};
