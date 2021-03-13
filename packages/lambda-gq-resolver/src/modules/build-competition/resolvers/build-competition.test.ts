/* eslint-disable no-return-await */
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';
import * as mockDb from '@test-utils/mock-db/db';
import mockDbUtils from '@test-utils/mock-db/mock-db-utils';

beforeAll(async () => {
    await testConn();
});

const buildMutation = `mutation buildCompetition($params: CompetitionParamsInput!, $id: ID!) {
    buildCompetition(id: $id, params: $params) {
      id
      rounds {
        items {
          type
          heats {
            items {
              name
              seedSlots {
                seed
                nextHeat{
                  name
                }
              }
            }
          }
        }
      }
    }
  }`;

const testCompParams = {
    rounds: [
        {
            roundNo: 1,
            type: 'UPPER',
            heats: [
                {
                    name: 'Heat 1',
                    seedSlots: [
                        {
                            seed: 1,
                        },
                        {
                            seed: 5,
                        },
                        {
                            seed: 9,
                        },
                        {
                            seed: 13,
                        },
                        {
                            seed: 17,
                        },
                        {
                            seed: 21,
                        },
                    ],
                },
                {
                    name: 'Heat 2',
                    seedSlots: [
                        {
                            seed: 3,
                        },
                        {
                            seed: 7,
                        },
                        {
                            seed: 11,
                        },
                        {
                            seed: 15,
                        },
                        {
                            seed: 19,
                        },
                        {
                            seed: 23,
                        },
                    ],
                },
                {
                    name: 'Heat 3',
                    seedSlots: [
                        {
                            seed: 2,
                        },
                        {
                            seed: 6,
                        },
                        {
                            seed: 10,
                        },
                        {
                            seed: 14,
                        },
                        {
                            seed: 18,
                        },
                        {
                            seed: 22,
                        },
                    ],
                },
                {
                    name: 'Heat 4',
                    seedSlots: [
                        {
                            seed: 4,
                        },
                        {
                            seed: 8,
                        },
                        {
                            seed: 12,
                        },
                        {
                            seed: 16,
                        },
                        {
                            seed: 20,
                        },
                        {
                            seed: 24,
                        },
                    ],
                },
            ],
        },
        {
            roundNo: 2,
            type: 'LOWER',
            heats: [
                {
                    name: 'LCQ 1',
                    seedSlots: [
                        {
                            seed: 9,
                        },
                        {
                            seed: 13,
                        },
                        {
                            seed: 17,
                        },
                        {
                            seed: 21,
                        },
                        {
                            seed: 11,
                        },
                        {
                            seed: 15,
                        },
                        {
                            seed: 19,
                        },
                        {
                            seed: 23,
                        },
                    ],
                },
                {
                    name: 'LCQ 2',
                    seedSlots: [
                        {
                            seed: 10,
                        },
                        {
                            seed: 14,
                        },
                        {
                            seed: 18,
                        },
                        {
                            seed: 22,
                        },
                        {
                            seed: 12,
                        },
                        {
                            seed: 16,
                        },
                        {
                            seed: 20,
                        },
                        {
                            seed: 24,
                        },
                    ],
                },
            ],
        },
        {
            roundNo: 2,
            type: 'UPPER',
            heats: [
                {
                    name: 'SF1',
                    seedSlots: [
                        {
                            seed: 1,
                        },
                        {
                            seed: 3,
                        },
                        {
                            seed: 5,
                        },
                        {
                            seed: 7,
                        },
                        {
                            seed: 9,
                        },
                    ],
                },
                {
                    name: 'SF2',
                    seedSlots: [
                        {
                            seed: 2,
                        },
                        {
                            seed: 4,
                        },
                        {
                            seed: 6,
                        },
                        {
                            seed: 8,
                        },
                        {
                            seed: 10,
                        },
                    ],
                },
            ],
        },
        {
            roundNo: 3,
            type: 'UPPER',
            heats: [
                {
                    name: 'Final',
                    seedSlots: [
                        {
                            seed: 1,
                        },
                        {
                            seed: 2,
                        },
                        {
                            seed: 3,
                        },
                        {
                            seed: 4,
                        },
                        {
                            seed: 5,
                        },
                        {
                            seed: 6,
                        },
                    ],
                },
            ],
        },
    ],
};

const expectedResponse = {
    buildCompetition: {
        id: 'testCompetition',
        rounds: {
            items: [
                {
                    type: 'UPPER',
                    heats: {
                        items: [
                            {
                                name: 'Heat 1',
                                seedSlots: [
                                    {
                                        seed: 1,
                                        nextHeat: {
                                            name: 'SF1',
                                        },
                                    },
                                    {
                                        seed: 5,
                                        nextHeat: {
                                            name: 'SF1',
                                        },
                                    },
                                    {
                                        seed: 9,
                                        nextHeat: {
                                            name: 'LCQ 1',
                                        },
                                    },
                                    {
                                        seed: 13,
                                        nextHeat: {
                                            name: 'LCQ 1',
                                        },
                                    },
                                    {
                                        seed: 17,
                                        nextHeat: {
                                            name: 'LCQ 1',
                                        },
                                    },
                                    {
                                        seed: 21,
                                        nextHeat: {
                                            name: 'LCQ 1',
                                        },
                                    },
                                ],
                            },
                            {
                                name: 'Heat 2',
                                seedSlots: [
                                    {
                                        seed: 3,
                                        nextHeat: {
                                            name: 'SF1',
                                        },
                                    },
                                    {
                                        seed: 7,
                                        nextHeat: {
                                            name: 'SF1',
                                        },
                                    },
                                    {
                                        seed: 11,
                                        nextHeat: {
                                            name: 'LCQ 1',
                                        },
                                    },
                                    {
                                        seed: 15,
                                        nextHeat: {
                                            name: 'LCQ 1',
                                        },
                                    },
                                    {
                                        seed: 19,
                                        nextHeat: {
                                            name: 'LCQ 1',
                                        },
                                    },
                                    {
                                        seed: 23,
                                        nextHeat: {
                                            name: 'LCQ 1',
                                        },
                                    },
                                ],
                            },
                            {
                                name: 'Heat 3',
                                seedSlots: [
                                    {
                                        seed: 2,
                                        nextHeat: {
                                            name: 'SF2',
                                        },
                                    },
                                    {
                                        seed: 6,
                                        nextHeat: {
                                            name: 'SF2',
                                        },
                                    },
                                    {
                                        seed: 10,
                                        nextHeat: {
                                            name: 'LCQ 2',
                                        },
                                    },
                                    {
                                        seed: 14,
                                        nextHeat: {
                                            name: 'LCQ 2',
                                        },
                                    },
                                    {
                                        seed: 18,
                                        nextHeat: {
                                            name: 'LCQ 2',
                                        },
                                    },
                                    {
                                        seed: 22,
                                        nextHeat: {
                                            name: 'LCQ 2',
                                        },
                                    },
                                ],
                            },
                            {
                                name: 'Heat 4',
                                seedSlots: [
                                    {
                                        seed: 4,
                                        nextHeat: {
                                            name: 'SF2',
                                        },
                                    },
                                    {
                                        seed: 8,
                                        nextHeat: {
                                            name: 'SF2',
                                        },
                                    },
                                    {
                                        seed: 12,
                                        nextHeat: {
                                            name: 'LCQ 2',
                                        },
                                    },
                                    {
                                        seed: 16,
                                        nextHeat: {
                                            name: 'LCQ 2',
                                        },
                                    },
                                    {
                                        seed: 20,
                                        nextHeat: {
                                            name: 'LCQ 2',
                                        },
                                    },
                                    {
                                        seed: 24,
                                        nextHeat: {
                                            name: 'LCQ 2',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: 'LOWER',
                    heats: {
                        items: [
                            {
                                name: 'LCQ 1',
                                seedSlots: [
                                    {
                                        seed: 9,
                                        nextHeat: {
                                            name: 'SF1',
                                        },
                                    },
                                    {
                                        seed: 13,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 17,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 21,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 11,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 15,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 19,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 23,
                                        nextHeat: null,
                                    },
                                ],
                            },
                            {
                                name: 'LCQ 2',
                                seedSlots: [
                                    {
                                        seed: 10,
                                        nextHeat: {
                                            name: 'SF2',
                                        },
                                    },
                                    {
                                        seed: 14,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 18,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 22,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 12,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 16,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 20,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 24,
                                        nextHeat: null,
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: 'UPPER',
                    heats: {
                        items: [
                            {
                                name: 'SF1',
                                seedSlots: [
                                    {
                                        seed: 1,
                                        nextHeat: {
                                            name: 'Final',
                                        },
                                    },
                                    {
                                        seed: 3,
                                        nextHeat: {
                                            name: 'Final',
                                        },
                                    },
                                    {
                                        seed: 5,
                                        nextHeat: {
                                            name: 'Final',
                                        },
                                    },
                                    {
                                        seed: 7,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 9,
                                        nextHeat: null,
                                    },
                                ],
                            },
                            {
                                name: 'SF2',
                                seedSlots: [
                                    {
                                        seed: 2,
                                        nextHeat: {
                                            name: 'Final',
                                        },
                                    },
                                    {
                                        seed: 4,
                                        nextHeat: {
                                            name: 'Final',
                                        },
                                    },
                                    {
                                        seed: 6,
                                        nextHeat: {
                                            name: 'Final',
                                        },
                                    },
                                    {
                                        seed: 8,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 10,
                                        nextHeat: null,
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: 'UPPER',
                    heats: {
                        items: [
                            {
                                name: 'Final',
                                seedSlots: [
                                    {
                                        seed: 1,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 2,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 3,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 4,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 5,
                                        nextHeat: null,
                                    },
                                    {
                                        seed: 6,
                                        nextHeat: null,
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        },
    },
};

describe('BuildCompetition', () => {
    it('buildCompetiton', async () => {
        await mockDbUtils.populateDb(mockDb.competitionEmpty);

        const response = await gCall({
            source: buildMutation,
            variableValues: {
                id: mockDb.competitionEmpty.competitions[0].id,
                params: testCompParams,
            },
        });

        expect(response).toMatchObject({
            data: expectedResponse,
        });
    });
});
