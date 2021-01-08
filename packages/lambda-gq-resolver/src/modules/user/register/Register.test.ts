/* eslint-disable no-return-await */
import { mapper } from '../../../utils/mapper';
import User from '../../../domain-models/User';
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
    fullName
  }
}`;

describe('Register', () => {
  it('create user', async () => {
    const user = { firstName: 'Test', lastName: 'Testy', email: 'testy@test.com' };

    const response = await gCall({
      source: registerMutation,
      variableValues: { input: user },
    });
    console.log('response', response);

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });

    await expect(mapper.get(Object.assign(new User(), { id: response.data.register.id }))).resolves.toBeTruthy();

    console.log('global.externalLibrary', (global as any).externalLibrary);
  });
});
