/* eslint-disable class-methods-use-this */

import { Resolver, Query, Mutation, Arg, Ctx, ID } from 'type-graphql';
import { Context } from 'src/types';
import { createUniqueCondition, mapper } from 'src/utils/mapper';
import User from 'src/domain/models/user';

@Resolver()
class GetDataEntityResolver {
    @Query(() => User, { nullable: true })
    async getDataEntity(@Arg('id', () => ID) id: string): Promise<User> {
        console.log(`Id is ${id}`);
        return null;
    }
}

export default GetDataEntityResolver;
