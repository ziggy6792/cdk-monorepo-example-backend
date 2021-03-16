/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { HeatStatus } from 'src/domain/models/heat';
import { RoundType } from 'src/domain/models/round';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
class SeedSlotParamsInput {
    @Field(() => Int)
    seed: number;
}

@InputType()
class HeatParamsInput {
    @Field()
    name: string;

    @Field(() => HeatStatus, { nullable: true })
    status: HeatStatus;

    @Field(() => [SeedSlotParamsInput])
    seedSlots: SeedSlotParamsInput[];
}

@InputType()
class RoundParamsInput {
    @Field(() => Int)
    roundNo: number;

    @Field(() => RoundType)
    type: RoundType;

    @Field(() => [HeatParamsInput])
    heats: HeatParamsInput[];
}

@InputType()
export class CompetitionParamsInput {
    @Field(() => [RoundParamsInput])
    rounds: RoundParamsInput[];
}
