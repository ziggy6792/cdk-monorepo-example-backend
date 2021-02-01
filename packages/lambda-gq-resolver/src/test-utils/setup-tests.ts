import clearDb from './clear-db';

const main = async (): Promise<void> => {
    await clearDb();
};

main().then(() => {
    console.log('cleanup done');
});
