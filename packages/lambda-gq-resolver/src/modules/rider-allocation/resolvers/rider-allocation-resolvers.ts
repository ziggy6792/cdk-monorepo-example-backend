import RiderAllocation from 'src/domain/models/rider-allocation';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import { CreateRiderAllocationInput, UpdateRiderAllocationInput } from 'src/modules/rider-allocation/inputs';

const CrudResolvers = buildCrudResolvers('RiderAllocation', RiderAllocation, {
    create: { inputType: CreateRiderAllocationInput, resolverProps: { one: true } },
    update: { inputType: UpdateRiderAllocationInput, resolverProps: { many: true } },
});

export default [...CrudResolvers];
