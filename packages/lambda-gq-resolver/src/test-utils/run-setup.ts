import clearDb from './clear-db';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const main = async (): Promise<void> => {
    await clearDb();
    console.log('timer done');
};

main().then(() => {
    console.log('hello');
});
