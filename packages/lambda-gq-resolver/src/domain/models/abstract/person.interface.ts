/* eslint-disable import/prefer-default-export */
import { InterfaceType, Field, Int, ID, Arg } from 'type-graphql';

@InterfaceType({
    // workaround for bug: https://github.com/MichalLytek/type-graphql/issues/373
    resolveType: (value) => value.constructor.name,
})
export abstract class IPerson {
    @Field((type) => ID)
    id: string;

    @Field()
    name: string;

    @Field((type) => Int)
    age: number;
}
