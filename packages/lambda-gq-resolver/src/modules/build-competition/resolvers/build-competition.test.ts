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
                items {
                  seed                  
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
                                seedSlots: {
                                    items: [
                                        { seed: 1, parentSeedSlot: { seed: 1 } },
                                        { seed: 5, parentSeedSlot: { seed: 5 } },
                                        { seed: 9, parentSeedSlot: { seed: 9 } },
                                        { seed: 13, parentSeedSlot: { seed: 13 } },
                                        { seed: 17, parentSeedSlot: { seed: 17 } },
                                        { seed: 21, parentSeedSlot: { seed: 21 } },
                                    ],
                                },
                            },
                            {
                                name: 'Heat 2',
                                seedSlots: {
                                    items: [
                                        { seed: 3, parentSeedSlot: { seed: 3 } },
                                        { seed: 7, parentSeedSlot: { seed: 7 } },
                                        { seed: 11, parentSeedSlot: { seed: 11 } },
                                        { seed: 15, parentSeedSlot: { seed: 15 } },
                                        { seed: 19, parentSeedSlot: { seed: 19 } },
                                        { seed: 23, parentSeedSlot: { seed: 23 } },
                                    ],
                                },
                            },
                            {
                                name: 'Heat 3',
                                seedSlots: {
                                    items: [
                                        { seed: 2, parentSeedSlot: { seed: 2 } },
                                        { seed: 6, parentSeedSlot: { seed: 6 } },
                                        { seed: 10, parentSeedSlot: { seed: 10 } },
                                        { seed: 14, parentSeedSlot: { seed: 14 } },
                                        { seed: 18, parentSeedSlot: { seed: 18 } },
                                        { seed: 22, parentSeedSlot: { seed: 22 } },
                                    ],
                                },
                            },
                            {
                                name: 'Heat 4',
                                seedSlots: {
                                    items: [
                                        { seed: 4, parentSeedSlot: { seed: 4 } },
                                        { seed: 8, parentSeedSlot: { seed: 8 } },
                                        { seed: 12, parentSeedSlot: { seed: 12 } },
                                        { seed: 16, parentSeedSlot: { seed: 16 } },
                                        { seed: 20, parentSeedSlot: { seed: 20 } },
                                        { seed: 24, parentSeedSlot: { seed: 24 } },
                                    ],
                                },
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
                                seedSlots: {
                                    items: [
                                        { seed: 9, parentSeedSlot: { seed: 9 } },
                                        { seed: 11, parentSeedSlot: null },
                                        { seed: 13, parentSeedSlot: null },
                                        { seed: 15, parentSeedSlot: null },
                                        { seed: 17, parentSeedSlot: null },
                                        { seed: 19, parentSeedSlot: null },
                                        { seed: 21, parentSeedSlot: null },
                                        { seed: 23, parentSeedSlot: null },
                                    ],
                                },
                            },
                            {
                                name: 'LCQ 2',
                                seedSlots: {
                                    items: [
                                        { seed: 10, parentSeedSlot: { seed: 10 } },
                                        { seed: 12, parentSeedSlot: null },
                                        { seed: 14, parentSeedSlot: null },
                                        { seed: 16, parentSeedSlot: null },
                                        { seed: 18, parentSeedSlot: null },
                                        { seed: 20, parentSeedSlot: null },
                                        { seed: 22, parentSeedSlot: null },
                                        { seed: 24, parentSeedSlot: null },
                                    ],
                                },
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
                                seedSlots: {
                                    items: [
                                        { seed: 1, parentSeedSlot: { seed: 1 } },
                                        { seed: 3, parentSeedSlot: { seed: 3 } },
                                        { seed: 5, parentSeedSlot: { seed: 5 } },
                                        { seed: 7, parentSeedSlot: null },
                                        { seed: 9, parentSeedSlot: null },
                                    ],
                                },
                            },
                            {
                                name: 'SF2',
                                seedSlots: {
                                    items: [
                                        { seed: 2, parentSeedSlot: { seed: 2 } },
                                        { seed: 4, parentSeedSlot: { seed: 4 } },
                                        { seed: 6, parentSeedSlot: { seed: 6 } },
                                        { seed: 8, parentSeedSlot: null },
                                        { seed: 10, parentSeedSlot: null },
                                    ],
                                },
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
                                seedSlots: {
                                    items: [
                                        { seed: 1, parentSeedSlot: null },
                                        { seed: 2, parentSeedSlot: null },
                                        { seed: 3, parentSeedSlot: null },
                                        { seed: 4, parentSeedSlot: null },
                                        { seed: 5, parentSeedSlot: null },
                                        { seed: 6, parentSeedSlot: null },
                                    ],
                                },
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
