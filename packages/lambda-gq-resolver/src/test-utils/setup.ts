// export default (): void => {
//   console.log('RUNNING SETUP!!!');
// };

import testConn from './test-conn';

const setup = async (): Promise<void> => {
  console.log('RUNNING SETUP!!!');
  await testConn(true);
};

setup();

// export default setup;
