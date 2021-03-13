/* eslint-disable no-return-await */
import User from 'src/domain/models/user';
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';

beforeAll(async () => {
    await testConn();
});

afterAll(async () => {
    // AWS.DynamoDB
});

const createUserMutation = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    firstName
    lastName
    fullName
  }
}`;

describe('User', () => {
    it('create user', async () => {
        const user = { firstName: 'Test Firstname', lastName: 'Test Lastname', email: 'testy@test.com' };

        const response = await gCall({
            source: createUserMutation,
            variableValues: { input: user },
        });
        console.log('response', response);

        expect(response).toMatchObject({
            data: {
                createUser: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            },
        });

        await expect(User.store.get(response.data.createUser.id).exec()).resolves.toBeTruthy();
    });
});
