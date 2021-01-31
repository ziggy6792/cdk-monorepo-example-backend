/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import _ from 'lodash';
import { Field, ID, ObjectType, ClassType } from 'type-graphql';

// @ObjectType()
// class List<X> {
//     @Field(() => [X])
//     @attribute()
//     items: X[];
// }
// export default List;

function createListType<T extends ClassType>(objectTypeCls: T) {
    @ObjectType()
    class BaseResolver {
        //   protected items: T[] = [];

        //   @Query(type => [objectTypeCls], { name: `getAll${suffix}` })
        //   async getAll(@Arg("first", type => Int) first: number): Promise<T[]> {
        //     return this.items.slice(0, first);
        //   }

        @Field((type) => [objectTypeCls])
        @attribute()
        items: T[];
    }

    return BaseResolver as any;
}

export default createListType;
