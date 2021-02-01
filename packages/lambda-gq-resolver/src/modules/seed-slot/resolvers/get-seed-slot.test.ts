import { mapper } from 'src/utils/mapper';
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';
import SeedSlot from 'src/domain/models/seed-slot';

import RiderAllocation from 'src/domain/models/rider-allocation';

beforeAll(async () => {
    await testConn();
});

describe('getSeedSlot', () => {
    it('should get rider allocation', async () => {
        const query = `query GetSeedSlot($id: ID!) {
            getSeedSlot(id: $id) {
              id
              userId
              riderAllocation{
                allocatableId
                userId
              }
            }
          }`;

        let seedslot = new SeedSlot();

        const mockUserId = 'userId';
        const mockHeatId = 'headId';

        seedslot.id = 'seedSlotId';
        seedslot.userId = mockUserId;
        seedslot.heatId = mockHeatId;

        seedslot = await mapper.put(seedslot);

        let riderAllocation = new RiderAllocation();

        riderAllocation.userId = mockUserId;
        riderAllocation.allocatableId = mockHeatId;

        riderAllocation = await mapper.put(riderAllocation);

        const response = await gCall({
            source: query,
            variableValues: { id: seedslot.id },
        });

        expect(response).toMatchObject({
            data: { getSeedSlot: { id: 'seedSlotId', userId: 'userId', riderAllocation: { allocatableId: 'headId', userId: 'userId' } } },
        });
    });

    it('should get the parent seed slot', async () => {
        const query = `query GetSeedSlot($id: ID!) {
            getSeedSlot(id: $id) {
              id              
              parentSeedSlot{
                id
                userId
              }
            }
          }`;

        let parentSeedSlot = new SeedSlot();
        parentSeedSlot.id = 'parentSeedSlotId';
        parentSeedSlot.userId = 'userId';
        parentSeedSlot = await mapper.put(parentSeedSlot);

        let seedslot = new SeedSlot();
        seedslot.id = 'childSeedSlotId!';
        seedslot.parentSeedSlotId = parentSeedSlot.id;
        seedslot = await mapper.put(seedslot);

        const response = await gCall({
            source: query,
            variableValues: { id: seedslot.id },
        });

        expect(response).toMatchObject({ data: { getSeedSlot: { id: 'childSeedSlotId!', parentSeedSlot: { id: 'parentSeedSlotId', userId: 'userId' } } } });
    });
});
