import RiderAllocation from 'src/domain/models/rider-allocation';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import { CreateRiderAllocationInput } from 'src/modules/rider-allocation/inputs';

const CrudResolvers = createCrudResolvers('RiderAllocation', RiderAllocation, {
    create: { inputType: CreateRiderAllocationInput, resolvers: { one: true, many: true } },
});

export default [...CrudResolvers];
