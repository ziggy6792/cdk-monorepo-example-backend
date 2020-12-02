/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import { GraphQLSchema } from 'graphql';
import 'reflect-metadata';
import { Resolver, Query, buildSchemaSync } from 'type-graphql';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      schema: GraphQLSchema;
    }
  }
}
@Resolver()
class HelloResolver {
  private recipesCollection: string[] = [];

  @Query((returns) => String)
  async hello() {
    console.log('Running hello resolver');
    return 'Hello Worldy';
  }
}

global.schema =
  global.schema ||
  buildSchemaSync({
    resolvers: [HelloResolver],
  });

const { schema } = global;

export default schema;
