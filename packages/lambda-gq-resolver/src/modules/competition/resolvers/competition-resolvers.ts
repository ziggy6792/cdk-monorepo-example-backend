import CompetitionModel from 'src/domain/models/competition';
import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import { CreateCompetitionInput, UpdateCompetitionInput } from 'src/modules/competition/inputs';

const CrudResolvers = createCrudResolvers('Competition', CompetitionModel, {
    create: { middleware: [isAuthRole], inputType: CreateCompetitionInput },
    update: { middleware: [isAuthRole], inputType: UpdateCompetitionInput },
    list: { middleware: [isAuthRole] },
    get: { middleware: [isAuthRole] },
    delete: { middleware: [isAuthRole] },
});

export default [...CrudResolvers];
