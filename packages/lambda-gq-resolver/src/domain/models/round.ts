/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import { Field, ObjectType, registerEnumType, Int, ID } from 'type-graphql';
import BaseModelWithId from 'src/domain/abstract-models/base-model-with-id';

export enum RoundType {
    UPPER = 'UPPER',
    LOWER = 'LOWER',
}

registerEnumType(RoundType, {
    name: 'RoundType', // this one is mandatory
    description: 'The Round Type', // this one is optional
});

@ObjectType()
@table('Round')
class Round extends BaseModelWithId {
    @Field(() => Int)
    @attribute()
    roundNo: number;

    @Field(() => RoundType)
    @attribute()
    tpye: RoundType;

    @Field(() => ID)
    @attribute()
    competitionId: string;

    @Field()
    @attribute()
    startTime: string;
}

// heats: [Heat] @connection(keyName: "byRound", fields: ["id"])
// competition: Competition @connection(fields: ["competitionId"])

export default Round;
