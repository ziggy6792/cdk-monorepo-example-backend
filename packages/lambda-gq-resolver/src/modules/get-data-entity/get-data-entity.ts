/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx, ID } from 'type-graphql';
import { Context } from 'src/types';
import { createUniqueCondition, mapper } from 'src/utils/mapper';
import Event from 'src/domain/models/event';

@Resolver()
class GetDataEntityResolver {
    @Query(() => Event, { nullable: true })
    async getDataEntity(@Arg('id', () => ID) id: string): Promise<Event> {
        console.log(`Id is ${id}`);

        const entity = Object.assign(new Event(), { id });
        const ret = mapper.get(entity);
        return ret;
    }
}

export default GetDataEntityResolver;
