const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const main = async () => {
    console.log('waiting for db');
    await delay(3000);
    console.log('creating tables');
};

main()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
