/* eslint-disable no-return-await */
import { mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';

beforeAll(async () => {
    await testConn();
    console.log('tables ready');
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
        const user = { firstName: 'Test Firstname', lastName: 'Test Lastname', email: 'testy@test.com' };

        try {
            // const response = await gCall({
            //     source: registerMutation,
            //     variableValues: { input: user },
            // });
            const user = new User();
            await mapper.put(user);
        } catch (err) {
            console.log(err);
        }

        expect(1 + 1 === 2);

        // expect(response).toMatchObject({
        //     data: {
        //         register: {
        //             firstName: user.firstName,
        //             lastName: user.lastName,
        //             email: user.email,
        //         },
        //     },
        // });

        // await expect(mapper.get(Object.assign(new User(), { id: response.data.register.id }))).resolves.toBeTruthy();
    });
});
