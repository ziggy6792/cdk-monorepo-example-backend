/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { Field, ObjectType, registerEnumType, Int, ID } from 'type-graphql';
import Identifiable from 'src/domain/interfaces/identifiable';
import { HeatList } from 'src/domain/objects/lists';
import * as utils from 'src/utils/utility';
import { commonConfig } from '@alpaca-backend/common';
import DynamoStore from 'src/utils/dynamo-easy/dynamo-store';
import { GSIPartitionKey, Model, Property } from '@shiftcoders/dynamo-easy';
import Creatable from 'src/domain/interfaces/creatable';
import dateMapper from 'src/utils/dynamo-easy/mappers/date-mapper';
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

const tableSchema = commonConfig.DB_SCHEMA.Round;

@ObjectType({ implements: [Identifiable, Creatable] })
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
    @Property({ mapper: dateMapper })
    startTime: Date;

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
        return Competition.store.get(this.competitionId).exec();
    }

    async getChildren(): Promise<Creatable[]> {
        return this.getHeats();
    }
}

Round.store = new DynamoStore(Round);

export default Round;
