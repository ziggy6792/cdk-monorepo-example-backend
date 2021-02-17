import RiderAllocation from 'src/domain/models/rider-allocation';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateRiderAllocationInput, UpdateRiderAllocationInput } from 'src/modules/rider-allocation/inputs';

import { MiddlewareFn } from 'type-graphql';

import { IContext, IdentityType } from 'src/types';

const isAllowedToCreate: MiddlewareFn<IContext> = async ({ context: { identity } }, next) => {
    if (identity.type === IdentityType.ROLE) {
        return next();
    }
    throw new Error('not authenticated');

    return next();
};

const CrudResolvers = buildCrudResolvers('RiderAllocation', RiderAllocation, {
    idFields: ['allocatableId', 'userId'],
    resolvers: {
        create: { inputType: CreateRiderAllocationInput, resolverProps: { one: { middleware: [isAllowedToCreate] } } },
        update: { inputType: UpdateRiderAllocationInput, resolverProps: { many: true } },
    },
});

export default [...CrudResolvers];
