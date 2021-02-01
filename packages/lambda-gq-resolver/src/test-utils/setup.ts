import clearDb from './clear-db';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default async (): Promise<void> => {
    await delay(10000);
    await clearDb();
    console.log('timer done');
};
