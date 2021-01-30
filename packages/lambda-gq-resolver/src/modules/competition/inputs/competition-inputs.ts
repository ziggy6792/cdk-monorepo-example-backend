/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import { CompetitionStatus, Gender, Level, Sport } from 'src/domain/models/competition';
import { Field, InputType, ID, Int } from 'type-graphql';

@InputType()
class CompetitionInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    category: string;

    @Field(() => ID, { nullable: true })
    judgeUserId: string;

    @Field({ nullable: true })
    when: string;

    @Field(() => CompetitionStatus, { nullable: true })
    status: CompetitionStatus;

    @Field({ nullable: true })
    params: string;

    @Field({ nullable: true })
    selectedHeatId: string;

    @Field(() => Int, { nullable: true })
    maxRiders: string;

    @Field(() => Gender, { nullable: true })
    gender: Gender;

    @Field(() => Sport, { nullable: true })
    sport: Sport;

    @Field(() => Level, { nullable: true })
    level: Level;
}

@InputType()
export class CreateCompetitionInput extends CompetitionInput {
    @Field(() => ID, { nullable: true })
    id: string;

    @Field(() => ID)
    eventId: string;
}

@InputType()
export class UpdateCompetitionInput extends CompetitionInput {
    @Field(() => ID)
    id: string;
}
