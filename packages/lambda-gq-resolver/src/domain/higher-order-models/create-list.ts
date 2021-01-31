/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ID, ObjectType, ClassType } from 'type-graphql';

function createList<T extends ClassType>(objectTypeCls: T) {
    @ObjectType()
    class CompetitionList {
        @Field((type) => [objectTypeCls])
        @attribute()
        items: any[];
    }

    return CompetitionList;
}

export default createList;
