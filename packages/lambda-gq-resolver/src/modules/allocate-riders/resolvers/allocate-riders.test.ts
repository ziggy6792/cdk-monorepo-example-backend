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
    id: '711ab0c8-d2bd-4759-bd07-dbe22748cce5',
    heats: {
        items: [
            {
                name: 'Heat 1',
                riderAllocations: {
                    items: [
                        { userId: '91a8c3c3-d713-40ad-a27e-24213553ec3e', startSeed: 1 },
                        { userId: '4a60183e-58c4-47da-b5e3-a8ba9e0233ce', startSeed: 5 },
                        { userId: 'cfdaa31e-3bdf-4915-961e-6cdc41237f61', startSeed: 9 },
                        { userId: '0d7c5c83-fd6d-4832-b46c-d9a12abd855b', startSeed: 13 },
                        { userId: 'b4ec60ff-2f2f-4c59-9bca-6d6e909635de', startSeed: 17 },
                        { userId: '387eb004-acc6-4eba-8857-0914bb9c9b18', startSeed: 21 },
                    ],
                },
                seedSlots: {
                    items: [
                        { seed: 1, riderAllocation: { userId: '91a8c3c3-d713-40ad-a27e-24213553ec3e' }, parentSeedSlot: { seed: 1 } },
                        { seed: 5, riderAllocation: { userId: '4a60183e-58c4-47da-b5e3-a8ba9e0233ce' }, parentSeedSlot: { seed: 5 } },
                        { seed: 9, riderAllocation: { userId: 'cfdaa31e-3bdf-4915-961e-6cdc41237f61' }, parentSeedSlot: { seed: 9 } },
                        { seed: 13, riderAllocation: { userId: '0d7c5c83-fd6d-4832-b46c-d9a12abd855b' }, parentSeedSlot: { seed: 13 } },
                        { seed: 17, riderAllocation: { userId: 'b4ec60ff-2f2f-4c59-9bca-6d6e909635de' }, parentSeedSlot: { seed: 17 } },
                        { seed: 21, riderAllocation: { userId: '387eb004-acc6-4eba-8857-0914bb9c9b18' }, parentSeedSlot: { seed: 21 } },
                    ],
                },
            },
            {
                name: 'Heat 2',
                riderAllocations: {
                    items: [
                        { userId: '75b502a6-e96f-462f-8adb-ca141df8e200', startSeed: 3 },
                        { userId: '8d31b060-f99c-46af-b5c4-4288fcdb7df2', startSeed: 7 },
                        { userId: '474755f3-d11f-4463-9443-6b836522ca7f', startSeed: 11 },
                        { userId: '49baf406-69b6-4e01-b157-daf4809d75bd', startSeed: 15 },
                        { userId: '13fee42b-6d6e-42ef-8f4f-87cfbbd7f92a', startSeed: 19 },
                        { userId: '48d4a70c-6e04-4308-86d1-d2bdf2f5e03a', startSeed: 23 },
                    ],
                },
                seedSlots: {
                    items: [
                        { seed: 3, riderAllocation: { userId: '75b502a6-e96f-462f-8adb-ca141df8e200' }, parentSeedSlot: { seed: 3 } },
                        { seed: 7, riderAllocation: { userId: '8d31b060-f99c-46af-b5c4-4288fcdb7df2' }, parentSeedSlot: { seed: 7 } },
                        { seed: 11, riderAllocation: { userId: '474755f3-d11f-4463-9443-6b836522ca7f' }, parentSeedSlot: { seed: 11 } },
                        { seed: 15, riderAllocation: { userId: '49baf406-69b6-4e01-b157-daf4809d75bd' }, parentSeedSlot: { seed: 15 } },
                        { seed: 19, riderAllocation: { userId: '13fee42b-6d6e-42ef-8f4f-87cfbbd7f92a' }, parentSeedSlot: { seed: 19 } },
                        { seed: 23, riderAllocation: { userId: '48d4a70c-6e04-4308-86d1-d2bdf2f5e03a' }, parentSeedSlot: { seed: 23 } },
                    ],
                },
            },
            {
                name: 'Heat 3',
                riderAllocations: {
                    items: [
                        { userId: '32148bf8-91a0-42d1-9297-00fe0dcea9a5', startSeed: 2 },
                        { userId: '6119faa5-28d3-4ede-a966-1ceb956a2e21', startSeed: 6 },
                        { userId: '05f7aeed-4590-4ca0-b449-143ee2ac41e5', startSeed: 10 },
                        { userId: 'e0ed7f32-d7ef-4b95-8878-2fbea31b5284', startSeed: 14 },
                        { userId: '3e83dbf3-7ef2-4128-a059-ade598339b42', startSeed: 18 },
                        { userId: 'ca2830d1-7709-4bfd-9331-7d60be954329', startSeed: 22 },
                    ],
                },
                seedSlots: {
                    items: [
                        { seed: 2, riderAllocation: { userId: '32148bf8-91a0-42d1-9297-00fe0dcea9a5' }, parentSeedSlot: { seed: 2 } },
                        { seed: 6, riderAllocation: { userId: '6119faa5-28d3-4ede-a966-1ceb956a2e21' }, parentSeedSlot: { seed: 6 } },
                        { seed: 10, riderAllocation: { userId: '05f7aeed-4590-4ca0-b449-143ee2ac41e5' }, parentSeedSlot: { seed: 10 } },
                        { seed: 14, riderAllocation: { userId: 'e0ed7f32-d7ef-4b95-8878-2fbea31b5284' }, parentSeedSlot: { seed: 14 } },
                        { seed: 18, riderAllocation: { userId: '3e83dbf3-7ef2-4128-a059-ade598339b42' }, parentSeedSlot: { seed: 18 } },
                        { seed: 22, riderAllocation: { userId: 'ca2830d1-7709-4bfd-9331-7d60be954329' }, parentSeedSlot: { seed: 22 } },
                    ],
                },
            },
            {
                name: 'Heat 4',
                riderAllocations: {
                    items: [
                        { userId: 'ef55c9ce-de96-4564-81e0-15dc6cf08568', startSeed: 4 },
                        { userId: 'e65f7581-8b40-4c9f-93c2-cd18acc734fe', startSeed: 8 },
                        { userId: '7f980135-1be2-4998-8a97-0ab067355605', startSeed: 12 },
                        { userId: '3f9979ed-3d8d-4396-ae8e-8eff1e97e87d', startSeed: 16 },
                        { userId: '01846938-3827-4b2f-838b-4cb32e32243a', startSeed: 20 },
                        { userId: '667e119f-622b-4258-a6be-10292a33275a', startSeed: 24 },
                    ],
                },
                seedSlots: {
                    items: [
                        { seed: 4, riderAllocation: { userId: 'ef55c9ce-de96-4564-81e0-15dc6cf08568' }, parentSeedSlot: { seed: 4 } },
                        { seed: 8, riderAllocation: { userId: 'e65f7581-8b40-4c9f-93c2-cd18acc734fe' }, parentSeedSlot: { seed: 8 } },
                        { seed: 12, riderAllocation: { userId: '7f980135-1be2-4998-8a97-0ab067355605' }, parentSeedSlot: { seed: 12 } },
                        { seed: 16, riderAllocation: { userId: '3f9979ed-3d8d-4396-ae8e-8eff1e97e87d' }, parentSeedSlot: { seed: 16 } },
                        { seed: 20, riderAllocation: { userId: '01846938-3827-4b2f-838b-4cb32e32243a' }, parentSeedSlot: { seed: 20 } },
                        { seed: 24, riderAllocation: { userId: '667e119f-622b-4258-a6be-10292a33275a' }, parentSeedSlot: { seed: 24 } },
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
