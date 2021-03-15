/* eslint-disable no-return-await */
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';
import * as mockDb from '@test-utils/mock-db/db';
import mockDbUtils from '@test-utils/mock-db/mock-db-utils';
import _ from 'lodash';

beforeAll(async () => {
    await testConn();
});

const endHeatMutation = `mutation endHeat($id: ID!) {
    endHeat(id: $id) {
      id
      status
      rounds {
        items {
          heats {
            items {
              id
              status
            }
          }
        }
      }
    }
  }`;

const getCompetitionQuery = `query getCompetition {
    getCompetition(id: "testCompetition") {
      rounds {
        items {
          heats {
            items {
              name
              status
              riderAllocations {
                items {
                  userId
                  position
                  startSeed
                  runs {
                    score
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

const expectedRound1 = {
    heats: {
        items: [
            {
                name: 'Heat 1',
                status: 'CLOSED',
            },
            {
                name: 'Heat 2',
                status: 'CLOSED',
            },
            {
                name: 'Heat 3',
                status: 'CLOSED',
            },
            {
                name: 'Heat 4',
                status: 'CLOSED',
            },
        ],
    },
};

const expectedLCQs = {
    heats: {
        items: [
            {
                name: 'LCQ 1',
                riderAllocations: {
                    items: [
                        { userId: 'riderV', position: null, startSeed: 9, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderC', position: null, startSeed: 11, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderM', position: null, startSeed: 13, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderP', position: null, startSeed: 15, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderA', position: null, startSeed: 17, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderT', position: null, startSeed: 19, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderI', position: null, startSeed: 21, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderG', position: null, startSeed: 23, runs: [{ score: null }, { score: null }] },
                    ],
                },
            },
            {
                name: 'LCQ 2',
                riderAllocations: {
                    items: [
                        { userId: 'riderF', position: null, startSeed: 10, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderQ', position: null, startSeed: 12, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderS', position: null, startSeed: 14, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderD', position: null, startSeed: 16, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderW', position: null, startSeed: 18, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderL', position: null, startSeed: 20, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderO', position: null, startSeed: 22, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderU', position: null, startSeed: 24, runs: [{ score: null }, { score: null }] },
                    ],
                },
            },
        ],
    },
};

const expectedSemiFinals = {
    heats: {
        items: [
            {
                name: 'SF1',
                riderAllocations: {
                    items: [
                        { userId: 'riderR', position: null, startSeed: 1, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderK', position: null, startSeed: 3, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderE', position: null, startSeed: 5, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderX', position: null, startSeed: 7, runs: [{ score: null }, { score: null }] },
                    ],
                },
            },
            {
                name: 'SF2',
                riderAllocations: {
                    items: [
                        { userId: 'riderB', position: null, startSeed: 2, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderY', position: null, startSeed: 4, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderJ', position: null, startSeed: 6, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderH', position: null, startSeed: 8, runs: [{ score: null }, { score: null }] },
                    ],
                },
            },
        ],
    },
};

describe('Score Run', () => {
    it('score runs in parallel', async () => {
        await mockDbUtils.populateDb(mockDb.competitionPreEndHeat);

        const endHeatFns = ['heat1', 'heat2', 'heat3', 'heat4'].map((heatId) => async () =>
            await gCall({
                source: endHeatMutation,
                variableValues: {
                    id: heatId,
                },
            })
        );
        const results = await Promise.all(endHeatFns.map((fn) => fn()));

        const response = await gCall({
            source: getCompetitionQuery,
            variableValues: {
                id: 'testCompetition',
            },
        });

        // console.log(JSON.stringify(response.data.getCompetition.rounds.items[0]));

        expect(response.data.getCompetition.rounds.items[0]).toMatchObject(expectedRound1);
        expect(response.data.getCompetition.rounds.items[1]).toMatchObject(expectedLCQs);
        expect(response.data.getCompetition.rounds.items[2]).toMatchObject(expectedSemiFinals);
    });
});
