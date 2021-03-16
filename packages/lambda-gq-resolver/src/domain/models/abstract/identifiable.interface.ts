/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { Field, ID, InterfaceType, ObjectType } from 'type-graphql';
import { PartitionKey } from '@shiftcoders/dynamo-easy';
import ICreatable from './creatable.interface';

@InterfaceType({
    // workaround for bug: https://github.com/MichalLytek/type-graphql/issues/373
    resolveType: (value) => value.constructor.name,
    implements: ICreatable,
})
abstract class IIdentifiable extends ICreatable {
    @Field(() => ID, { nullable: true })
    @PartitionKey()
    id: string;

    // @Field()
    // readonly createdAt: string;

    // @Field()
    // modifiedAt: string;

    constructor() {
        super();
        this.id = uuidv4();
    }
}

export default IIdentifiable;
