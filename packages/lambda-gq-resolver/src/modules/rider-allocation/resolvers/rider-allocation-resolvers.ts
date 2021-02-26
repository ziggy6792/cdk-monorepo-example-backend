import isAuthRole, { getIsAuthRole } from 'src/middleware/is-auth-role';
import { mapper } from 'src/utils/mapper';
import RiderAllocation from 'src/domain/models/rider-allocation';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateRiderAllocationInput, UpdateRiderAllocationInput } from 'src/modules/rider-allocation/inputs';

import { MiddlewareFn } from 'type-graphql';

import { IContext } from 'src/types';
import errorMessage from 'src/config/error-message';
import Competition from 'src/domain/models/competition';
import Event from 'src/domain/models/event';
import { toArray } from 'src/utils/async-iterator';
import _ from 'lodash';
import createAuthMiddleware, { AuthCheck } from 'src/middleware/create-auth-middleware';

const isAllowedToCreateOne: AuthCheck = async (action) => {
    const {
        args,
        context: { identity },
    } = action;

    const input = args.input as CreateRiderAllocationInput;

    if (identity.user?.username === input.userId) {
        return true;
    }

    throw new Error(errorMessage.notAuthenticated);
};

const isAllowedToUpdateMany: AuthCheck = async (action) => {
    const {
        args,
        context: { identity },
    } = action;
    console.log('isAllowedToUpdateMany identity', identity);

    const riderAllocations = args.input as UpdateRiderAllocationInput[];

    const competitionIds = _.uniqWith(
        riderAllocations.map((input) => Object.assign(new Competition(), { id: input.allocatableId })),
        _.isEqual
    );

    // Get rider allocation competitions
    const competitions = await toArray(mapper.batchGet(competitionIds));

    const eventIds = _.uniqWith(
        competitions.map((competition) => Object.assign(new Event(), { id: competition.eventId })),
        _.isEqual
    );

    // Get competition events
    const events = await toArray(mapper.batchGet(eventIds));

    // Check that user is admin of those events
    events.forEach((event) => {
        if (event.adminUserId !== identity.user?.username) {
            throw new Error(errorMessage.notAuthenticated);
        }
    });

    return true;
};

const addDefaultUserId: MiddlewareFn<IContext> = async ({ args, context: { identity } }, next) => {
    args.input.userId = args.input.userId || identity.user?.username;
    if (!args.input.userId) {
        throw new Error(errorMessage.noUserId);
    }
    return next();
};

const crudResolvers = buildCrudResolvers('RiderAllocation', RiderAllocation, {
    idFields: ['allocatableId', 'userId'],
    crudProps: {
        create: {
            inputType: CreateRiderAllocationInput,
            resolverProps: {
                one: { middleware: [addDefaultUserId, createAuthMiddleware([getIsAuthRole, isAllowedToCreateOne])] },
                many: { middleware: [isAuthRole] },
            },
        },
        update: {
            inputType: UpdateRiderAllocationInput,
            resolverProps: { many: { middleware: [createAuthMiddleware([getIsAuthRole, isAllowedToUpdateMany])] } },
        },
    },
});

export default [...crudResolvers];
