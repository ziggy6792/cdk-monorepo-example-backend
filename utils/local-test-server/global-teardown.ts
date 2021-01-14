import { stop } from './local-db-util';

// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const tearDown = async (): Promise<void> => {
  stop();
};

export default tearDown;
