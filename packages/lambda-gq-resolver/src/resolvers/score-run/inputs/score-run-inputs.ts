/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { Field, InputType, ID, Float } from 'type-graphql';

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
    heatId: string;

    @Field(() => ID)
    userId: string;

    @Field(() => [RunInput])
    runs: [RunInput];
}
