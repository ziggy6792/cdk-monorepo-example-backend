/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { Field, InputType, ID, Int } from 'type-graphql';
import { UpdateRiderAllocationInput } from 'src/modules/crud/rider-allocation/inputs/rider-allocation-inputs';
import { Run } from 'src/domain/models/rider-allocation';

@InputType()
export class ScorRunInput {
    @Field(() => ID)
    allocatableId: string;

    @Field(() => ID)
    userId: string;

    // @Field(() => [Run])
    // runs: [Run];
}
