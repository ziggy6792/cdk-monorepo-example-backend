/* eslint-disable no-return-await */
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';
import * as mockDb from '@test-utils/mock-db/db';
import mockDbUtils from '@test-utils/mock-db/mock-db-utils';

beforeAll(async () => {
    await testConn();
});

const scoreRunMutation = `mutation scoreRun($input: ScorRunInput!) {
    scoreRun(input: $input) {
      seedSlots {
        items {
          id
          userId
          seed
          position
  
          riderAllocation {
            startSeed
            runs {
              score
            }
          }
        }
      }  
    }
  }
  `;

const getHeatQuery = `query getHeat($heatId: ID!) {
    getHeat(id: $heatId) {
      seedSlots {
        items {
          id
          userId
          seed
          position
  
          riderAllocation {
            startSeed
            runs {
              score
            }
          }
        }
      }
    }
  }
  `;

describe('AllocateRider', () => {
    it('allocateRiders', async () => {
        await mockDbUtils.populateDb(mockDb.competitionPreScoreRuns);

        const scores = [
            { userId: 'riderA', runs: [{ score: 10 }, { score: null }] },
            { userId: 'riderD', runs: [{ score: 3 }, { score: 14 }] },
            { userId: 'riderH', runs: [{ score: 16 }, { score: 50 }] },
            { userId: 'riderL', runs: [{ score: 40 }, { score: null }] },
            // { userId: 'riderU', runs: [{ score: 20 }, { score: 30 }] },
        ];

        const callFns = scores.map((score) => async () =>
            await gCall({
                source: scoreRunMutation,
                variableValues: {
                    input: {
                        heatId: 'heat1',
                        ...score,
                    },
                },
            })
        );
        // const results = await Promise.all(callFns.map((fn) => fn()));

        for (let i = 0; i < callFns.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            await callFns[i]();
        }

        const response = await gCall({
            source: getHeatQuery,
            variableValues: {
                heatId: 'heat1',
            },
        });

        // const response = await gCall({
        //     source: allocateMutation,
        //     variableValues: {
        //         input: {
        //             heatId: 'heat1',
        //             userId: 'riderU',
        //             runs: [
        //                 {
        //                     score: 3,
        //                 },
        //                 {
        //                     score: 30,
        //                 },
        //             ],
        //         },
        //     },
        // });
        // const firstRoundResponse = response.data.allocateRiders.rounds.items[0];
        // expect(firstRoundResponse).toMatchObject(expectedFirstRoundResult);
        console.log('response', JSON.stringify(response));
    });
});
