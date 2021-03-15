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

const getHeatQuery = `query getHeat($heatId: ID!) {
  getHeat(id: $heatId) {
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
`;

const expectedResult = {
    name: 'Heat 1',
    riderAllocations: {
        items: [
            {
                userId: 'riderR',
                position: 1,
                startSeed: 17,
                runs: [
                    {
                        score: 16,
                    },
                    {
                        score: 50,
                    },
                ],
            },
            {
                userId: 'riderE',
                position: 2,
                startSeed: 5,
                runs: [
                    {
                        score: 30,
                    },
                    {
                        score: 45,
                    },
                ],
            },
            {
                userId: 'riderV',
                position: 3,
                startSeed: 21,
                runs: [
                    {
                        score: 40,
                    },
                    {
                        score: null,
                    },
                ],
            },
            {
                userId: 'riderM',
                position: 4,
                startSeed: 13,
                runs: [
                    {
                        score: 3,
                    },
                    {
                        score: 14,
                    },
                ],
            },
            {
                userId: 'riderA',
                position: 5,
                startSeed: 1,
                runs: [
                    {
                        score: 10,
                    },
                    {
                        score: null,
                    },
                ],
            },
            {
                userId: 'riderI',
                position: 6,
                startSeed: 9,
                runs: [
                    {
                        score: 5,
                    },
                    {
                        score: 10,
                    },
                ],
            },
        ],
    },
};

const scores = [
    { userId: 'riderA', runs: [{ score: 10 }, { score: null }] },
    { userId: 'riderM', runs: [{ score: 3 }, { score: 14 }] },
    { userId: 'riderR', runs: [{ score: 16 }, { score: 50 }] },
    { userId: 'riderV', runs: [{ score: 40 }, { score: null }] },
    { userId: 'riderE', runs: [{ score: 30 }, { score: 45 }] },
    { userId: 'riderI', runs: [{ score: 5 }, { score: 10 }] },
];

describe('Score Run', () => {
    it('scorRun in sync', async () => {
        await mockDbUtils.populateDb(mockDb.competitionPreScoreRuns);

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

        expect(response.data.getHeat).toMatchObject(expectedResult);
    });
    it('scorRun in parallel', async () => {
        await mockDbUtils.populateDb(mockDb.competitionPreScoreRuns);

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
        const results = await Promise.all(callFns.map((fn) => fn()));

        const response = await gCall({
            source: getHeatQuery,
            variableValues: {
                heatId: 'heat1',
            },
        });

        expect(response.data.getHeat).toMatchObject(expectedResult);
    });
});
