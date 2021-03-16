/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */

import { Resolver, Query, Arg, ID } from 'type-graphql';
import Event from 'src/domain/models/event';
import DataEntity from 'src/domain/interfaces/data-entity';
import Competition from 'src/domain/models/competition';
import Heat from 'src/domain/models/heat';

@Resolver()
class GetDataEntityResolver {
    @Query(() => DataEntity, { nullable: true })
    async getDataEntity(@Arg('id', () => ID) id: string): Promise<DataEntity> {
        const results = await Promise.allSettled([Event, Competition, Heat].map((entity) => entity.store.get(id).exec()));

        const fullfilledResults = results.filter((res) => res.status === 'fulfilled');

        if (fullfilledResults.length > 0 && fullfilledResults[0].status === 'fulfilled') {
            return fullfilledResults[0].value;
        }

        return null;
    }
}

export default GetDataEntityResolver;
