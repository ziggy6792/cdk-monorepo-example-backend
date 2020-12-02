/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */
// import 'source-map-support/register';
// import { ApolloServer, gql } from 'apollo-server-lambda';
// import { buildSchema, Resolver, Query } from 'type-graphql';

// @Resolver()
// class HelloResolver {
//   private recipesCollection: string[] = [];

//   @Query((returns) => [String])
//   async hello() {
//     return 'Hello World';
//   }
// }

// const schema =  buildSchema({
//   resolvers: [HelloResolver],
// });

// const apolloServer = new ApolloServer({ schema });

// export const handler = async (event: any): Promise<any> => {

//   return {
//     statusCode: 200,
//     body: 'hello from lambda-gq-resolver',
//   };
// };

import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-lambda';
import { buildSchema, Resolver, Query } from 'type-graphql';

@Resolver()
class HelloResolver {
  private recipesCollection: string[] = [];

  @Query((returns) => [String])
  async hello() {
    return 'Hello World';
  }
}

const globalSchema = buildSchema({
  resolvers: [HelloResolver],
});

async function getServer() {
  const schema = await globalSchema;
  return new ApolloServer({
    schema,
  });
}

export function handler(event: any, ctx: any, callback: any): any {
  getServer()
    .then((server) => server.createHandler())
    .then((handler) => handler(event, ctx, callback));
}
