import Event from 'src/domain/models/event';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateEventInput, UpdateEventInput } from 'src/modules/event/inputs';

const CrudResolvers = buildCrudResolvers('Event', Event, {
    crudProps: {
        create: { inputType: CreateEventInput, resolverProps: { one: true } },
        update: { inputType: UpdateEventInput, resolverProps: { one: true } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: true } },
    },
});

export default [...CrudResolvers];
