/* eslint-disable no-return-await */
import { mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';

beforeAll(async () => {
    await testConn();
    console.log('finished setup');
});

afterAll(async () => {
    console.log('finished!');
    // AWS.DynamoDB
});

const registerMutation = `mutation CreateUser($input: CreateUserInput!) {
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
            source: registerMutation,
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

        await expect(mapper.get(Object.assign(new User(), { id: response.data.createUser.id }))).resolves.toBeTruthy();
    });
});
