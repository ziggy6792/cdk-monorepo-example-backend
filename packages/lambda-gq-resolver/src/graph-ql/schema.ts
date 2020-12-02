/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import 'reflect-metadata';
import { Resolver, Query, buildSchemaSync } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

// eslint-disable-next-line import/no-mutable-exports
let schema: GraphQLSchema;

// declare var schema: GraphQLSchema
@Resolver()
class HelloResolver {
  private recipesCollection: string[] = [];

  @Query((returns) => String)
  async hello() {
    console.log('Running hello resolver');
    return 'Hello World';
  }
}

global.schema =
  global.schema ||
  buildSchemaSync({
    resolvers: [HelloResolver],
  });

export default schema;
