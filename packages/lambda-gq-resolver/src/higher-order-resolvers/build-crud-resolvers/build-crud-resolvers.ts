/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { ICreateCrudResolverOptions } from './types';

import CrudResolverManager from './crud-resolver-manager';

const buildCrudResolvers = (suffix: string, returnType: any, resolverOptions: ICreateCrudResolverOptions): any[] => {
    const crudResolverManager = new CrudResolverManager(suffix, returnType, resolverOptions);

    console.log('crudResolvers', crudResolverManager.getCrudResolvers());

    return crudResolverManager.getCrudResolvers();
    // console.log('resolverOptions', applyDefaults(resolverOptions));
    // let crudResolvers = [];

    // const createResolverProps = crudResolverManager.getCreateResolversProps();

    // if (createResolverProps) {
    //     crudResolvers = [...crudResolvers, buildCreateResolvers(createResolverProps)];
    // }
    // if (getOptions) {
    //     const resolverProps = getExpandedResolverProps(getOptions.resolverProps);
    //     if (resolverProps.one) {
    //         crudResolvers.push(buildGetOneResolver(suffix, returnType, resolverProps.one.middleware));
    //     }
    //     if (resolverProps.many) {
    //         crudResolvers.push(builGetManyResolver(suffix, returnType, resolverProps.many.middleware));
    //     }
    // }
    // if (updateOptions) {
    //     const resolverProps = getExpandedResolverProps(updateOptions.resolverProps);
    //     if (resolverProps.one) {
    //         crudResolvers.push(buildUpdateOneResolver(suffix, returnType, updateOptions.inputType, idFields, resolverProps.one.middleware));
    //     }
    //     if (resolverProps.many) {
    //         crudResolvers.push(buildUpdateManyResolver(suffix, returnType, updateOptions.inputType, idFields, resolverProps.many.middleware));
    //     }
    // }
    // if (deleteOptions) {
    //     const resolverProps = getExpandedResolverProps(deleteOptions.resolverProps);
    //     if (resolverProps.one) {
    //         crudResolvers.push(buildDeleteOneResolver(suffix, returnType, resolverProps.one.middleware));
    //     }
    //     if (resolverProps.many) {
    //         crudResolvers.push(buildDeleteManyResolver(suffix, returnType, resolverProps.many.middleware));
    //     }
    // }
};

export default buildCrudResolvers;
