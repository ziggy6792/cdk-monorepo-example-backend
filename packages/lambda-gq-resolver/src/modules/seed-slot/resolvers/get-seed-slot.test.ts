/* eslint-disable no-return-await */
import { mapper } from 'src/utils/mapper';
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';
import SeedSlot from 'src/domain/models/seed-slot';

import console from 'console';
import RiderAllocation from 'src/domain/models/rider-allocation';

beforeAll(async () => {
    await testConn();
});

const getSeedSlotQuery = `query GetSeedSlot($id: ID!) {
    getSeedSlot(id: $id) {
      id
      userId
      riderAllocation{
        allocatableId
        userId
      }
    }
  }`;

describe('SeedSlot', () => {
    it('get', async () => {
        let seedslot = new SeedSlot();

        const mockUserId = '123';
        const mockHeatId = '456';

        seedslot.userId = mockUserId;
        seedslot.heatId = mockHeatId;

        seedslot = await mapper.put(seedslot);

        console.log('seedslotid', seedslot.id);

        let riderAllocation = new RiderAllocation();

        riderAllocation.userId = mockUserId;
        riderAllocation.allocatableId = mockHeatId;

        riderAllocation = await mapper.put(riderAllocation);

        // const dynamodb = new AWS.DynamoDB(TEST_DB_CONFIG);

        const response = await gCall({
            source: getSeedSlotQuery,
            variableValues: { id: seedslot.id },
        });
        console.log('response', JSON.stringify(response));

        const expectedResult = {
            data: { getSeedSlot: { id: seedslot.id, userId: '123', riderAllocation: { allocatableId: '456', userId: '123' } } },
        };

        expect(response).toMatchObject(expectedResult);
    });
});
