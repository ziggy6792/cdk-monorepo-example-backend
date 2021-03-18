/* eslint-disable no-return-await */
import { testUsers } from '@test-utils/mock-db/db';
import _ from 'lodash';
import Event from 'src/domain/models/event';
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';

beforeAll(async () => {
    await testConn();
});

const createEventMutation = `mutation createEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      adminUserId
      startTime
      name
    }
  }`;

const pad = (number: number, digits: number): string => Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number;

describe('Create Event', () => {
    it.skip('create event', async () => {
        const event = {
            id: 'obstacleJam',
            name: 'Obstacle Jam Test',
            startTime: '2021-03-01T05:51:01.844Z',
            adminUserId: testUsers.facebookUser.id,
        };

        const response = await gCall({
            source: createEventMutation,
            variableValues: { input: event },
        });

        expect(response).toMatchObject({
            data: {
                createEvent: event,
            },
        });

        await expect(Event.store.get(response.data.createEvent.id).exec()).resolves.toBeTruthy();
    });

    it('create events', async () => {
        const testEvents = _.range(1, 11).map((index) => ({
            id: `testEvent${index}`,
            name: `Test Event ${index}`,
            startTime: `2021-03-${pad(index, 2)}T05:51:01.844Z`,
            adminUserId: testUsers.facebookUser.id,
        }));

        const response = await Promise.all(
            testEvents.map((event) =>
                gCall({
                    source: createEventMutation,
                    variableValues: { input: event },
                })
            )
        );

        await expect(Event.store.get(response[0].data.createEvent.id).exec()).resolves.toBeTruthy();
    });
});
