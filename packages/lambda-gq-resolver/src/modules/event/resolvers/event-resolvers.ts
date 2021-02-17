import Event from 'src/domain/models/event';
import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import { CreateEventInput, UpdateEventInput } from 'src/modules/event/inputs';

const CrudResolvers = createCrudResolvers('Event', Event, {
    create: { inputType: CreateEventInput, options: { one: true } },
    update: { inputType: UpdateEventInput, options: { one: true } },
    get: { options: { one: true, many: true } },
    delete: { options: { one: true } },
});

export default [...CrudResolvers];
