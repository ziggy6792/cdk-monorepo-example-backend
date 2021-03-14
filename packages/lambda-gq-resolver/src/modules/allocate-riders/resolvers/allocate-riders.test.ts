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
            }
          }
        }
      }
    }
  }`;

const expectedFirstRoundResult = {
    id: 'round1Upper',
    heats: {
        items: [
            {
                name: 'Heat 1',
                riderAllocations: {
                    items: [
                        {
                            userId: 'riderA',
                            startSeed: 1,
                        },
                        {
                            userId: 'riderM',
                            startSeed: 13,
                        },
                        {
                            userId: 'riderR',
                            startSeed: 17,
                        },
                        {
                            userId: 'riderV',
                            startSeed: 21,
                        },
                        {
                            userId: 'riderE',
                            startSeed: 5,
                        },
                        {
                            userId: 'riderI',
                            startSeed: 9,
                        },
                    ],
                },
            },
            {
                name: 'Heat 2',
                riderAllocations: {
                    items: [
                        {
                            userId: 'riderK',
                            startSeed: 11,
                        },
                        {
                            userId: 'riderP',
                            startSeed: 15,
                        },
                        {
                            userId: 'riderT',
                            startSeed: 19,
                        },
                        {
                            userId: 'riderX',
                            startSeed: 23,
                        },
                        {
                            userId: 'riderC',
                            startSeed: 3,
                        },
                        {
                            userId: 'riderG',
                            startSeed: 7,
                        },
                    ],
                },
            },
            {
                name: 'Heat 3',
                riderAllocations: {
                    items: [
                        {
                            userId: 'riderJ',
                            startSeed: 10,
                        },
                        {
                            userId: 'riderO',
                            startSeed: 14,
                        },
                        {
                            userId: 'riderS',
                            startSeed: 18,
                        },
                        {
                            userId: 'riderB',
                            startSeed: 2,
                        },
                        {
                            userId: 'riderW',
                            startSeed: 22,
                        },
                        {
                            userId: 'riderF',
                            startSeed: 6,
                        },
                    ],
                },
            },
            {
                name: 'Heat 4',
                riderAllocations: {
                    items: [
                        {
                            userId: 'riderL',
                            startSeed: 12,
                        },
                        {
                            userId: 'riderQ',
                            startSeed: 16,
                        },
                        {
                            userId: 'riderU',
                            startSeed: 20,
                        },
                        {
                            userId: 'riderY',
                            startSeed: 24,
                        },
                        {
                            userId: 'riderD',
                            startSeed: 4,
                        },
                        {
                            userId: 'riderH',
                            startSeed: 8,
                        },
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

        // console.log('Response', JSON.stringify(response));
        const firstRoundResponse = response.data.allocateRiders.rounds.items[0];
        expect(firstRoundResponse).toMatchObject(expectedFirstRoundResult);
        const dbAsJson = await mockDbUtils.dbToJson();
        console.log(JSON.stringify(dbAsJson.riderAllocations));
    });
});
