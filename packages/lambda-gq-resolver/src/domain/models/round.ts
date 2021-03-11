/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { Field, ObjectType, registerEnumType, Int, ID } from 'type-graphql';
import Identifiable from 'src/domain/models/abstract/identifiable';
import { HeatList } from 'src/domain/common-objects/lists';
import * as utils from 'src/utils/utility';
import { commonConfig } from '@alpaca-backend/common';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { GSIPartitionKey, Model } from '@shiftcoders/dynamo-easy';
import Heat from './heat';
import Competition from './competition';
import Creatable from './abstract/creatable';

export enum RoundType {
    UPPER = 'UPPER',
    LOWER = 'LOWER',
}

registerEnumType(RoundType, {
    name: 'RoundType', // this one is mandatory
    description: 'The Round Type', // this one is optional
});

const tableSchema = commonConfig.DB_SCHEMA.Round;

@ObjectType()
@Model({ tableName: utils.getTableName(tableSchema.tableName) })
class Round extends Identifiable {
    static store: DynamoStore<Round>;

    @Field(() => Int)
    roundNo: number;

    @Field(() => RoundType)
    type: RoundType;

    @Field(() => ID)
    @GSIPartitionKey(tableSchema.indexes.byCompetition.indexName)
    competitionId: string;

    @Field()
    startTime: string;

    @Field(() => HeatList)
    async getHeats(): Promise<Heat[]> {
        return Heat.store.query().index(commonConfig.DB_SCHEMA.Heat.indexes.byRound.indexName).wherePartitionKey(this.id).execFetchAll();
    }

    @Field(() => HeatList)
    protected async heats(): Promise<HeatList> {
        const list = new HeatList();
        list.items = await this.getHeats();
        return list;
    }

    @Field(() => Competition, { name: 'competition' })
    async getCompetition(): Promise<Competition> {
        // return mapper.get(Object.assign(new Competition(), { id: this.competitionId }));
        return Competition.store.get(this.competitionId).exec();
    }

    async getChildren(): Promise<Creatable[]> {
        return this.getHeats();
    }
}

Round.store = new DynamoStore(Round);

export default Round;
