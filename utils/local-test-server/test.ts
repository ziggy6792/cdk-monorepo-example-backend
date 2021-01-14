import setup from './global-setup';
import tearDown from './global-teardown';

const main = async (): Promise<void> => {
  await setup();
  await tearDown();
};

main();
