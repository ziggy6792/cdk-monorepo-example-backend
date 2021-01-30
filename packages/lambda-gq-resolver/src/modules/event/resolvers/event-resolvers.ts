import Event from 'src/domain-models/event';
import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import { CreateEventInput, UpdateEventInput } from 'src/modules/event/inputs/event-inputs';

const CrudResolvers = createCrudResolvers('Event', Event, {
    createOptions: { middleware: [isAuthRole], inputType: CreateEventInput },
    updateOptions: { middleware: [isAuthRole], inputType: UpdateEventInput },
    listOptions: { middleware: [isAuthRole] },
    getOptions: { middleware: [isAuthRole] },
    deleteOptions: { middleware: [isAuthRole] },
});

export default [...CrudResolvers];
