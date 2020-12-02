/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema, Resolver, Query } from 'type-graphql';

@Resolver()
class HelloResolver {
  private recipesCollection: string[] = [];

  @Query((returns) => [String])
  async hello() {
    return 'Hello World';
  }
}

export const handler = async (event: any): Promise<any> => {
  const schema = await buildSchema({
    resolvers: [HelloResolver],
  });

  const apolloServer = new ApolloServer({ schema });

  return {
    statusCode: 200,
    body: 'hello from lambda-gq-resolver',
  };
};
