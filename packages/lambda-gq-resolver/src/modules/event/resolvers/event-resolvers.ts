import Event from 'src/domain/models/event';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateEventInput, UpdateEventInput } from 'src/modules/event/inputs';

const CrudResolvers = buildCrudResolvers('Event', Event, {
    crudProps: {
        create: { inputType: CreateEventInput, resolverProps: { one: { middleware: [] } } },
        update: { inputType: UpdateEventInput, resolverProps: { one: { middleware: [] } } },
        get: { resolverProps: { one: { middleware: [] }, many: { middleware: [] } } },
        delete: { resolverProps: { one: { middleware: [] } } },
    },
});

export default [...CrudResolvers];
