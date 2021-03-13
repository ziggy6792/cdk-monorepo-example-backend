/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import { PartitionKey } from '@shiftcoders/dynamo-easy';
import Creatable from './creatable';

@ObjectType({ isAbstract: true })
abstract class Identifiable extends Creatable {
    @Field(() => ID, { nullable: true })
    @PartitionKey()
    id: string;

    constructor() {
        super();
        this.id = uuidv4();
    }

    setDefaults(): void {
        super.setDefaults();
        this.id = uuidv4();
    }
}

export default Identifiable;
