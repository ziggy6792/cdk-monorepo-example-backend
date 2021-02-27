import Event from 'src/domain/models/event';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateEventInput, UpdateEventInput } from 'src/modules/event/inputs';

import errorMessage from 'src/config/error-message';
import { MiddlewareFn } from 'type-graphql';
import { IContext } from 'src/types';

const addDefaultUserId: MiddlewareFn<IContext> = async ({ args, context: { identity } }, next) => {
    const input = args.input as CreateEventInput;
    input.adminUserId = input.adminUserId || identity.user?.username;
    if (!input.adminUserId) {
        throw new Error(errorMessage.noUserId);
    }
    return next();
};

const CrudResolvers = buildCrudResolvers('Event', Event, {
    crudProps: {
        create: { inputType: CreateEventInput, resolverProps: { one: { middleware: [addDefaultUserId] } } },
        update: { inputType: UpdateEventInput, resolverProps: { one: true } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: true } },
    },
});

export default [...CrudResolvers];
