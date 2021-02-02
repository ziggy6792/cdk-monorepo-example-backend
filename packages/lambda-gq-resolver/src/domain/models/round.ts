/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute, table } from '@aws/dynamodb-data-mapper-annotations';
import { Field, ObjectType, registerEnumType, Int, ID } from 'type-graphql';
import Identifiable from 'src/domain/models/abstract/identifiable';
import { HeatList } from 'src/domain/common-objects/lists';
import { toArray } from 'src/utils/async-iterator';
import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import { mapper } from 'src/utils/mapper';
import Heat from './heat';
import Competition from './competition';

export enum RoundType {
    UPPER = 'UPPER',
    LOWER = 'LOWER',
}

registerEnumType(RoundType, {
    name: 'RoundType', // this one is mandatory
    description: 'The Round Type', // this one is optional
});

@ObjectType({ isAbstract: true })
@table('Round')
class Round extends Identifiable {
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

    @Field(() => HeatList)
    async getHeats(): Promise<Heat[]> {
        const filter: ConditionExpression = {
            subject: 'roundId',
            ...equals(this.id),
        };
        return toArray(mapper.scan(Heat, { filter }));
    }

    @Field(() => Competition)
    async getCompetition(): Promise<Competition> {
        return mapper.get(Object.assign(new Competition(), { id: this.competitionId }));
    }
}

export default Round;
