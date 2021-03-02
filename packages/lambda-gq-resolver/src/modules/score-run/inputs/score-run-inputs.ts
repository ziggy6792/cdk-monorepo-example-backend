/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { Field, InputType, ID, Int, Float } from 'type-graphql';
import { UpdateRiderAllocationInput } from 'src/modules/crud/rider-allocation/inputs/rider-allocation-inputs';
import { Run } from 'src/domain/models/rider-allocation';

@InputType()
export class RunInput {
    @Field(() => Float, { nullable: true })
    score: number;

    @Field({ nullable: true })
    isPublic: boolean;
}

@InputType()
export class ScorRunInput {
    @Field(() => ID)
    allocatableId: string;

    @Field(() => ID)
    userId: string;

    @Field(() => [RunInput])
    runs: [RunInput];
}
