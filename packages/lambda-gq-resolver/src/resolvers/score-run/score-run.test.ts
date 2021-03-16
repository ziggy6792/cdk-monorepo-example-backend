/* eslint-disable no-return-await */
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';
import * as mockDb from '@test-utils/mock-db/db';
import mockDbUtils from '@test-utils/mock-db/mock-db-utils';
import _ from 'lodash';

beforeAll(async () => {
    await testConn();
});

const scoreRunMutation = `mutation scoreRun($input: ScorRunInput!) {
  scoreRun(input: $input) {
    name
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
}`;

const getCompetitionQuery = `query getCompetition($id: ID!) {
    getCompetition(id: $id) {
      rounds {
        items {
          heats {
            items {
              name
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
  }`;

const scores = {
    heat1: [
        { userId: 'riderA', runs: [{ score: 10 }, { score: null }] },
        { userId: 'riderM', runs: [{ score: 3 }, { score: 14 }] },
        { userId: 'riderR', runs: [{ score: 16 }, { score: 50 }] },
        { userId: 'riderV', runs: [{ score: 40 }, { score: null }] },
        { userId: 'riderE', runs: [{ score: 30 }, { score: 45 }] },
        { userId: 'riderI', runs: [{ score: 5 }, { score: 10 }] },
    ],
    heat2: [
        { userId: 'riderK', runs: [{ score: 98 }, { score: 1 }] },
        { userId: 'riderP', runs: [{ score: 39 }, { score: 60 }] },
        { userId: 'riderT', runs: [{ score: 24 }, { score: 31 }] },
        { userId: 'riderX', runs: [{ score: 98 }, { score: 63 }] },
        { userId: 'riderC', runs: [{ score: 92 }, { score: 49 }] },
        { userId: 'riderG', runs: [{ score: 9 }, { score: 19 }] },
    ],
    heat3: [
        { userId: 'riderJ', runs: [{ score: 46 }, { score: 80 }] },
        { userId: 'riderO', runs: [{ score: 53 }, { score: 6 }] },
        { userId: 'riderS', runs: [{ score: 65 }, { score: 49 }] },
        { userId: 'riderB', runs: [{ score: 68 }, { score: 82 }] },
        { userId: 'riderW', runs: [{ score: 59 }, { score: 51 }] },
        { userId: 'riderF', runs: [{ score: 58 }, { score: 66 }] },
    ],
    heat4: [
        { userId: 'riderL', runs: [{ score: null }, { score: null }] },
        { userId: 'riderQ', runs: [{ score: 78 }, { score: 34 }] },
        { userId: 'riderU', runs: [{ score: null }, { score: null }] },
        { userId: 'riderY', runs: [{ score: 75 }, { score: 98 }] },
        { userId: 'riderD', runs: [{ score: null }, { score: null }] },
        { userId: 'riderH', runs: [{ score: 80 }, { score: 47 }] },
    ],
};

const expectedRound1Results = {
    heats: {
        items: [
            {
                name: 'Heat 1',
                riderAllocations: {
                    items: [
                        { userId: 'riderR', position: 1, startSeed: 17, runs: [{ score: 16 }, { score: 50 }] },
                        { userId: 'riderE', position: 2, startSeed: 5, runs: [{ score: 30 }, { score: 45 }] },
                        { userId: 'riderV', position: 3, startSeed: 21, runs: [{ score: 40 }, { score: null }] },
                        { userId: 'riderM', position: 4, startSeed: 13, runs: [{ score: 3 }, { score: 14 }] },
                        { userId: 'riderA', position: 5, startSeed: 1, runs: [{ score: 10 }, { score: null }] },
                        { userId: 'riderI', position: 6, startSeed: 9, runs: [{ score: 5 }, { score: 10 }] },
                    ],
                },
            },
            {
                name: 'Heat 2',
                riderAllocations: {
                    items: [
                        { userId: 'riderK', position: 1, startSeed: 11, runs: [{ score: 98 }, { score: 1 }] },
                        { userId: 'riderX', position: 2, startSeed: 23, runs: [{ score: 98 }, { score: 63 }] },
                        { userId: 'riderC', position: 3, startSeed: 3, runs: [{ score: 92 }, { score: 49 }] },
                        { userId: 'riderP', position: 4, startSeed: 15, runs: [{ score: 39 }, { score: 60 }] },
                        { userId: 'riderT', position: 5, startSeed: 19, runs: [{ score: 24 }, { score: 31 }] },
                        { userId: 'riderG', position: 6, startSeed: 7, runs: [{ score: 9 }, { score: 19 }] },
                    ],
                },
            },
            {
                name: 'Heat 3',
                riderAllocations: {
                    items: [
                        { userId: 'riderB', position: 1, startSeed: 2, runs: [{ score: 68 }, { score: 82 }] },
                        { userId: 'riderJ', position: 2, startSeed: 10, runs: [{ score: 46 }, { score: 80 }] },
                        { userId: 'riderF', position: 3, startSeed: 6, runs: [{ score: 58 }, { score: 66 }] },
                        { userId: 'riderS', position: 4, startSeed: 18, runs: [{ score: 65 }, { score: 49 }] },
                        { userId: 'riderW', position: 5, startSeed: 22, runs: [{ score: 59 }, { score: 51 }] },
                        { userId: 'riderO', position: 6, startSeed: 14, runs: [{ score: 53 }, { score: 6 }] },
                    ],
                },
            },
            {
                name: 'Heat 4',
                riderAllocations: {
                    items: [
                        { userId: 'riderY', position: 1, startSeed: 24, runs: [{ score: 75 }, { score: 98 }] },
                        { userId: 'riderH', position: 2, startSeed: 8, runs: [{ score: 80 }, { score: 47 }] },
                        { userId: 'riderQ', position: 3, startSeed: 16, runs: [{ score: 78 }, { score: 34 }] },
                        { userId: 'riderD', position: null, startSeed: 4, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderL', position: null, startSeed: 12, runs: [{ score: null }, { score: null }] },
                        { userId: 'riderU', position: null, startSeed: 20, runs: [{ score: null }, { score: null }] },
                    ],
                },
            },
        ],
    },
};

const scoreRunFns = _.flatten(
    Object.keys(scores).map((heatId) => {
        const heatScores = scores[heatId];
        const fns = heatScores.map((score) => async () =>
            await gCall({
                source: scoreRunMutation,
                variableValues: {
                    input: {
                        heatId,
                        ...score,
                    },
                },
            })
        );
        return fns;
    })
);

describe('Score Run', () => {
    it.skip('score runs in sync', async () => {
        await mockDbUtils.populateDb(mockDb.competitionPreScoreRuns);

        for (let i = 0; i < scoreRunFns.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            await scoreRunFns[i]();
        }

        const response = await gCall({
            source: getCompetitionQuery,
            variableValues: {
                id: 'testCompetition',
            },
        });

        expect(response.data.getCompetition.rounds.items[0]).toMatchObject(expectedRound1Results);
    });
    it('score runs in parallel', async () => {
        await mockDbUtils.populateDb(mockDb.competitionPreScoreRuns);

        const results = await Promise.all(scoreRunFns.map((fn) => fn()));

        const response = await gCall({
            source: getCompetitionQuery,
            variableValues: {
                id: 'testCompetition',
            },
        });

        expect(response.data.getCompetition.rounds.items[0]).toMatchObject(expectedRound1Results);
    });
});
