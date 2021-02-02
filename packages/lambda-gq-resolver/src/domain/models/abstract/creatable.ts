/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ID, ObjectType } from 'type-graphql';
import moment from 'src/utils/moment';
import getUniqueTimestamp from 'src/utils/get-unique-timestamp';

const getCreatedAt = (): string => getUniqueTimestamp().toString();
@ObjectType({ isAbstract: true })
abstract class Creatable {
    @Field(() => ID, { nullable: true })
    @attribute({ defaultProvider: () => getCreatedAt() })
    createdAt: string;

    @attribute({ defaultProvider: () => 'partition' })
    partition: string;

    setDefaults(): void {
        this.createdAt = getCreatedAt();
    }

    static createIndexes(): Promise<void> {
        // do nothing
        return null;
    }
}

export default Creatable;
