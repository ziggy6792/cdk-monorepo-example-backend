/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import { Field, ObjectType, ClassType } from 'type-graphql';

function createListObject<T extends ClassType>(objectTypeCls: T) {
    @ObjectType()
    class BaseList {
        @Field(() => [objectTypeCls])
        items: any[];
    }

    return BaseList;
}

export default createListObject;
