/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import Creatable from 'src/domain/models/abstract/creatable';
import { ResolverType, IBuildCrudProps, IOneResProps, IManyResProps, ICompleteCrudProps, Multiplicity, CrudBuilders, CreatableClassType } from './types';

import CrudResolverBuilder from './crud-resolver-builder';
import buildCreateResolvers from './build-create-resolvers';
import buildDeleteResolvers from './build-delete-resolvers';
import buildUpdateResolvers from './build-update-resolvers';
import buildGetResolvers from './build-get-resolvers';

const crudBuilders: CrudBuilders = {
    [ResolverType.CREATE]: buildCreateResolvers,
    [ResolverType.DELETE]: buildDeleteResolvers,
    [ResolverType.UPDATE]: buildUpdateResolvers,
    [ResolverType.GET]: buildGetResolvers,
};
const crudResolverBuilder = new CrudResolverBuilder(crudBuilders);

const buildCrudResolvers = (suffix: string, returnType: CreatableClassType, buildCrudProps: IBuildCrudProps): any[] => {
    const generatedCrudResolvers = crudResolverBuilder.buildCrudResolvers(suffix, returnType, buildCrudProps);

    return generatedCrudResolvers;
};

export default buildCrudResolvers;
