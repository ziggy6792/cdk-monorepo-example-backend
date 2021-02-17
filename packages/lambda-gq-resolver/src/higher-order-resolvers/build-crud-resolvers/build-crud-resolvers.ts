/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { ICreateCrudResolverOptions, CrudBuilders, ResolverType } from './types';

import CrudResolverBuilder from './crud-resolver-builder';
import { buildCreateResolvers } from './build-create-resolver';
import { buildDeleteResolvers } from './build-delete-resolver';
import { buildUpdateResolvers } from './build-update-resolver';
import { buildGetResolvers } from './build-get-resolver';

const resolverBuilderFunctions: CrudBuilders = {
    [ResolverType.CREATE]: buildCreateResolvers,
    [ResolverType.DELETE]: buildDeleteResolvers,
    [ResolverType.UPDATE]: buildUpdateResolvers,
    [ResolverType.GET]: buildGetResolvers,
};
const crudResolverManager = new CrudResolverBuilder(resolverBuilderFunctions);

const buildCrudResolvers = (suffix: string, returnType: any, resolverOptions: ICreateCrudResolverOptions): any[] => {
    const generatedCrudResolvers = crudResolverManager.buildCrudResolvers(suffix, returnType, resolverOptions);

    console.log('crudResolvers', generatedCrudResolvers);

    return generatedCrudResolvers;
};

export default buildCrudResolvers;
