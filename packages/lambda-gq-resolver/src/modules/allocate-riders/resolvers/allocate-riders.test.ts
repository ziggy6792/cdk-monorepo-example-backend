/* eslint-disable no-return-await */
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';
import * as mockDb from '@test-utils/mock-db/db';
import mockDbUtils from '@test-utils/mock-db/mock-db-utils';

beforeAll(async () => {
    await testConn();
});

const allocateMutation = `mutation allocateRiders($id: ID!) {
    allocateRiders(id: $id) {
      id
      rounds {
        items {
          id
          heats {
            items {
              name
              riderAllocations {
                items {
                  userId
                  startSeed
                }
              }
              name
              seedSlots {
                items {
                  seed
                  riderAllocation {
                    userId                  
                  }
                  parentSeedSlot {
                    seed
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `;

const expectedFirstRoundResult = {
    id: 'round1',
    heats: {
        items: [
            {
                name: 'Heat 1',
                riderAllocations: {
                    items: [
                        { userId: 'riderA', startSeed: 1 },
                        { userId: 'riderD', startSeed: 5 },
                        { userId: 'riderH', startSeed: 9 },
                        { userId: 'riderL', startSeed: 13 },
                        { userId: 'riderQ', startSeed: 17 },
                        { userId: 'riderT', startSeed: 21 },
                    ],
                },
                seedSlots: {
                    items: [
                        { seed: 1, riderAllocation: { userId: 'riderA' }, parentSeedSlot: { seed: 1 } },
                        { seed: 5, riderAllocation: { userId: 'riderD' }, parentSeedSlot: { seed: 5 } },
                        { seed: 9, riderAllocation: { userId: 'riderH' }, parentSeedSlot: { seed: 9 } },
                        { seed: 13, riderAllocation: { userId: 'riderL' }, parentSeedSlot: { seed: 13 } },
                        { seed: 17, riderAllocation: { userId: 'riderQ' }, parentSeedSlot: { seed: 17 } },
                        { seed: 21, riderAllocation: { userId: 'riderT' }, parentSeedSlot: { seed: 21 } },
                    ],
                },
            },
            {
                name: 'Heat 2',
                riderAllocations: {
                    items: [
                        { userId: 'riderC', startSeed: 3 },
                        { userId: 'riderF', startSeed: 7 },
                        { userId: 'riderJ', startSeed: 11 },
                        { userId: 'riderO', startSeed: 15 },
                        { userId: 'riderR', startSeed: 19 },
                        { userId: 'riderV', startSeed: 23 },
                    ],
                },
                seedSlots: {
                    items: [
                        { seed: 3, riderAllocation: { userId: 'riderC' }, parentSeedSlot: { seed: 3 } },
                        { seed: 7, riderAllocation: { userId: 'riderF' }, parentSeedSlot: { seed: 7 } },
                        { seed: 11, riderAllocation: { userId: 'riderJ' }, parentSeedSlot: { seed: 11 } },
                        { seed: 15, riderAllocation: { userId: 'riderO' }, parentSeedSlot: { seed: 15 } },
                        { seed: 19, riderAllocation: { userId: 'riderR' }, parentSeedSlot: { seed: 19 } },
                        { seed: 23, riderAllocation: { userId: 'riderV' }, parentSeedSlot: { seed: 23 } },
                    ],
                },
            },
            {
                name: 'Heat 3',
                riderAllocations: {
                    items: [
                        { userId: 'riderB', startSeed: 2 },
                        { userId: 'riderE', startSeed: 6 },
                        { userId: 'riderI', startSeed: 10 },
                        { userId: 'riderM', startSeed: 14 },
                        { userId: '3e83dbf3-7ef2-4128-a059-ade598339b42', startSeed: 18 },
                        { userId: 'riderU', startSeed: 22 },
                    ],
                },
                seedSlots: {
                    items: [
                        { seed: 2, riderAllocation: { userId: 'riderB' }, parentSeedSlot: { seed: 2 } },
                        { seed: 6, riderAllocation: { userId: 'riderE' }, parentSeedSlot: { seed: 6 } },
                        { seed: 10, riderAllocation: { userId: 'riderI' }, parentSeedSlot: { seed: 10 } },
                        { seed: 14, riderAllocation: { userId: 'riderM' }, parentSeedSlot: { seed: 14 } },
                        { seed: 18, riderAllocation: { userId: '3e83dbf3-7ef2-4128-a059-ade598339b42' }, parentSeedSlot: { seed: 18 } },
                        { seed: 22, riderAllocation: { userId: 'riderU' }, parentSeedSlot: { seed: 22 } },
                    ],
                },
            },
            {
                name: 'Heat 4',
                riderAllocations: {
                    items: [
                        { userId: 'ef55c9ce-de96-4564-81e0-15dc6cf08568', startSeed: 4 },
                        { userId: 'riderG', startSeed: 8 },
                        { userId: 'riderK', startSeed: 12 },
                        { userId: 'riderP', startSeed: 16 },
                        { userId: 'riderS', startSeed: 20 },
                        { userId: 'riderW', startSeed: 24 },
                    ],
                },
                seedSlots: {
                    items: [
                        { seed: 4, riderAllocation: { userId: 'ef55c9ce-de96-4564-81e0-15dc6cf08568' }, parentSeedSlot: { seed: 4 } },
                        { seed: 8, riderAllocation: { userId: 'riderG' }, parentSeedSlot: { seed: 8 } },
                        { seed: 12, riderAllocation: { userId: 'riderK' }, parentSeedSlot: { seed: 12 } },
                        { seed: 16, riderAllocation: { userId: 'riderP' }, parentSeedSlot: { seed: 16 } },
                        { seed: 20, riderAllocation: { userId: 'riderS' }, parentSeedSlot: { seed: 20 } },
                        { seed: 24, riderAllocation: { userId: 'riderW' }, parentSeedSlot: { seed: 24 } },
                    ],
                },
            },
        ],
    },
};

describe('AllocateRider', () => {
    it('allocateRiders', async () => {
        await mockDbUtils.populateDb(mockDb.competitionPreRiderAllocation);

        const response = await gCall({
            source: allocateMutation,
            variableValues: {
                id: 'testCompetition',
            },
        });
        const firstRoundResponse = response.data.allocateRiders.rounds.items[0];
        expect(firstRoundResponse).toMatchObject(expectedFirstRoundResult);

        // const dbAsJson = await mockDbUtils.dbToJson();
        // console.log(JSON.stringify(dbAsJson));
    });
});
