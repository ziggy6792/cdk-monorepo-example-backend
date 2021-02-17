import isAuthRole from 'src/middleware/is-auth-role';
import { mapper } from 'src/utils/mapper';
import RiderAllocation from 'src/domain/models/rider-allocation';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateRiderAllocationInput, UpdateRiderAllocationInput } from 'src/modules/rider-allocation/inputs';

import { MiddlewareFn } from 'type-graphql';

import { IContext, IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';
import Competition from 'src/domain/models/competition';
import Event from 'src/domain/models/event';
import { toArray } from 'src/utils/async-iterator';
import isAuthUserOrRole from 'src/middleware/is-auth-user-or-role';

const isAllowedToCreateOne: MiddlewareFn<IContext> = async ({ args, context: { identity } }, next) => {
    if (identity.type === IdentityType.ROLE) {
        return next();
    }

    const input = args.input as CreateRiderAllocationInput;

    if (identity.user?.username !== input.userId) {
        throw new Error(errorMessage.notAuthenticated);
    }

    return next();
};

const isAllowedToUpdateMany: MiddlewareFn<IContext> = async ({ args, context: { identity } }, next) => {
    if (identity.type === IdentityType.ROLE) {
        return next();
    }

    const riderAllocations = args.input as UpdateRiderAllocationInput[];

    const competitionIds = riderAllocations.map((input) => Object.assign(new Competition(), { id: input.allocatableId }));

    // Get rider allocation competitions
    const competitions = await toArray(mapper.batchGet(competitionIds));

    const eventIds = competitions.map((competition) => Object.assign(new Event(), { id: competition.eventId }));

    // Get competition events
    const events = await toArray(mapper.batchGet(eventIds));

    // Check that user is admin of those events
    events.forEach((event) => {
        if (event.adminUserId !== identity.user?.username) {
            throw new Error(errorMessage.notAuthenticated);
        }
    });

    console.log('events', events);

    return next();
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
    resolvers: {
        create: {
            inputType: CreateRiderAllocationInput,
            resolverProps: { one: { middleware: [isAuthUserOrRole, addDefaultUserId, isAllowedToCreateOne] }, many: { middleware: [isAuthRole] } },
        },
        update: { inputType: UpdateRiderAllocationInput, resolverProps: { many: { middleware: [isAuthUserOrRole, isAllowedToUpdateMany] } } },
    },
});

export default [...crudResolvers];
