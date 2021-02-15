/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { Field, InputType, ID, Int } from 'type-graphql';

@InputType()
class RiderAllocationInput {
    @Field(() => ID)
    allocatableId: string;

    @Field(() => ID)
    userId: string;

    @Field(() => Int)
    startSeed: number;
}

@InputType()
export class CreateRiderAllocationInput extends RiderAllocationInput {}
