/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-lambda';
import { Resolver, Query, buildSchemaSync } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import schema from './graph-ql/schema';

const server = new ApolloServer({ schema, introspection: true, playground: true });

exports.handler = server.createHandler();
