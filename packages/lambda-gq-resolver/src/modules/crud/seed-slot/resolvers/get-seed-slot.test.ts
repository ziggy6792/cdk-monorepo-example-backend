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

        const seedslot = new SeedSlot();

        const mockUserId = 'userId';
        const mockHeatId = 'headId';

        seedslot.id = 'seedSlotId';
        seedslot.userId = mockUserId;
        seedslot.heatId = mockHeatId;

        await SeedSlot.store.put(seedslot).exec();

        const riderAllocation = new RiderAllocation();

        riderAllocation.userId = mockUserId;
        riderAllocation.allocatableId = mockHeatId;

        await RiderAllocation.store.put(riderAllocation).exec();

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

        const parentSeedSlot = new SeedSlot();
        parentSeedSlot.id = 'parentSeedSlotId';
        parentSeedSlot.userId = 'userId';
        await SeedSlot.store.put(parentSeedSlot).exec();

        const seedslot = new SeedSlot();
        seedslot.id = 'childSeedSlotId';
        seedslot.parentSeedSlotId = parentSeedSlot.id;
        await SeedSlot.store.put(seedslot).exec();

        const response = await gCall({
            source: query,
            variableValues: { id: seedslot.id },
        });

        expect(response).toMatchObject({ data: { getSeedSlot: { id: 'childSeedSlotId', parentSeedSlot: { id: 'parentSeedSlotId', userId: 'userId' } } } });
    });
});
