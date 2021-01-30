import Competition from 'src/domain/models/competition';
import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import { CreateCompetitionInput, UpdateCompetitionInput } from 'src/modules/competition/inputs';

const CrudResolvers = createCrudResolvers('Competition', Competition, {
    createOptions: { middleware: [isAuthRole], inputType: CreateCompetitionInput },
    updateOptions: { middleware: [isAuthRole], inputType: UpdateCompetitionInput },
    listOptions: { middleware: [isAuthRole] },
    getOptions: { middleware: [isAuthRole] },
    deleteOptions: { middleware: [isAuthRole] },
});

export default [...CrudResolvers];
