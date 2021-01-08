/* eslint-disable no-return-await */
import { gCall } from '../../../test-utils/g-call';
import testConn from '../../../test-utils/test-conn';

beforeAll(async () => {
  await testConn();
});

const registerMutation = `mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    email
    firstName
    lastName
  }
}`;

describe('Register', () => {
  it('create user', async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: { input: { firstName: 'Test', lastName: 'Testy', email: 'testy@test.com' } },
    });
    console.log('response', response);
  });
});
