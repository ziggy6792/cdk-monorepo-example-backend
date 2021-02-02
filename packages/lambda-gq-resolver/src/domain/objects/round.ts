/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { HeatList } from 'src/domain/common-objects/lists';
import { mapper } from 'src/utils/mapper';
import * as models from 'src/domain/models';
import Competition from './competition';

export enum RoundType {
    UPPER = 'UPPER',
    LOWER = 'LOWER',
}

registerEnumType(RoundType, {
    name: 'RoundType', // this one is mandatory
    description: 'The Round Type', // this one is optional
});

@ObjectType()
class Round extends models.Round {
    @Field(() => HeatList)
    async heats(): Promise<HeatList> {
        const list = new HeatList();
        list.items = await this.getHeats();
        return list;
    }

    async competition(): Promise<Competition> {
        return mapper.get(Object.assign(new Competition(), { id: this.competitionId }));
    }
}

export default Round;
