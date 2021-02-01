/* eslint-disable no-return-await */
import { initTables, mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';
import SeedSlot from 'src/domain/models/seed-slot';

import AWS, { DynamoDB } from 'aws-sdk';
import TEST_DB_CONFIG from '@test-utils/config';
// // eslint-disable-next-line no-restricted-imports
// import { initTables } from '../utils/mapper';

beforeAll(async () => {
    await testConn();
});

const getSeedSlotQuery = `{getSeedSlot(id:"123"){
    id
    userId
  }}`;

//   @Field(() => SeedSlot)
//     async riderAllocation(): Promise<RiderAllocation> {
//         return mapper.get(Object.assign(new RiderAllocation(), { allocatableId: this.heatId, userId: this.userId }));
//     }

describe('SeedSlot', () => {
    it('get', async () => {
        await testConn();
        const seedslot = new SeedSlot();

        const mockUserId = '123';
        const mockHeatId = '456';

        seedslot.userId = mockUserId;
        seedslot.heatId = mockHeatId;

        console.log('mapper', JSON.stringify(mapper));

        // await mapper.put(seedslot);

        const dynamodb = new AWS.DynamoDB(TEST_DB_CONFIG);

        let tables: DynamoDB.ListTablesOutput;
        try {
            tables = await dynamodb.listTables().promise();
            console.log('tables', tables);
        } catch (err) {
            const errorMessage = "\nTest DB: Local db is not running. Please run 'yarn start' from root dir";
            console.log(`\n${errorMessage}`);
            throw new Error(errorMessage);
        }

        expect(1 + 1 === 2);

        // const user = { firstName: 'Test Firstname', lastName: 'Test Lastname', email: 'testy@test.com' };

        // const response = await gCall({
        //     source: getSeedSlotQuery,
        //     variableValues: { input: user },
        // });
        // console.log('response', response);

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
