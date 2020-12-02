// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */
// import 'reflect-metadata';
// import { ApolloServer } from 'apollo-server-lambda';
// import { buildSchema, Resolver, Query } from 'type-graphql';

// @Resolver()
// class HelloResolver {
//   private recipesCollection: string[] = [];

//   @Query((returns) => [String])
//   async hello() {
//     return 'Hello World';
//   }
// }

// const globalSchema = buildSchema({
//   resolvers: [HelloResolver],
// });

// async function getServer() {
//   const schema = await globalSchema;
//   return new ApolloServer({
//     schema,
//   });
// }

// export function handler(event: any, ctx: any, callback: any) {
//   getServer()
//     .then((server) => server.createHandler())
//     .then((handler) => handler(event, ctx, callback));
// }

/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-lambda';
import { buildSchema, Resolver, Query, buildSchemaSync } from 'type-graphql';

@Resolver()
class HelloResolver {
  private recipesCollection: string[] = [];

  @Query((returns) => [String])
  async hello() {
    return 'Hello World';
  }
}

(global as any).schema =
  (global as any).schema ||
  buildSchemaSync({
    resolvers: [HelloResolver],
  });

const server = new ApolloServer({ schema: (global as any).schema });

exports.handler = server.createHandler();
