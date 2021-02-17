/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import _ from 'lodash';

import {
    IBaseOne,
    IOneAndOrManyProps,
    IBaseMany,
    ICompleteCrudResolverOptions,
    ICreateCrudResolverOptions,
    IResolverOptions,
    IResProps,
    IBuildResolversProps,
    ResolverType,
    CrudBuilders,
} from './types';

const defaultResolverProps = {
    middleware: [],
};

const getExpandedResolverProps = <T>(options: IOneAndOrManyProps<T>): IBaseOne<T> & IBaseMany<T> => ({
    one: ((options as IBaseOne<T>)?.one as unknown) as T,
    many: ((options as IBaseMany<T>)?.many as unknown) as T,
});

const applyDefaults = (crudOptions: ICreateCrudResolverOptions): ICompleteCrudResolverOptions => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(crudOptions.resolvers)) {
        const resolverOptions = value as IResolverOptions<IResProps | boolean>;

        const resProps = getExpandedResolverProps(resolverOptions.resolverProps);

        resProps.one = resProps.one === true ? defaultResolverProps : resProps.one;
        resProps.many = resProps.many === true ? defaultResolverProps : resProps.many;
    }
    crudOptions.idFields = crudOptions.idFields || ['id'];

    return crudOptions as ICompleteCrudResolverOptions;
};

class CrudResolverBuilder {
    private crudBuilders: CrudBuilders;

    constructor(crudBuilders: CrudBuilders) {
        this.crudBuilders = crudBuilders;
    }

    public buildCrudResolvers(suffix: string, returnType: any, createCrudOptions: ICreateCrudResolverOptions): any[] {
        const completeOptions = applyDefaults(createCrudOptions);

        const generateResolversProps = (resolverType: ResolverType): IBuildResolversProps | null => {
            if (!completeOptions.resolvers[resolverType]) {
                return null;
            }
            const resolverProps = getExpandedResolverProps(completeOptions.resolvers[resolverType].resolverProps);
            const ret = {
                suffix,
                returnType,
                inputType: completeOptions.resolvers[resolverType as ResolverType.CREATE | ResolverType.UPDATE]?.inputType,
                idFields: completeOptions.idFields,
                resolverProps: {
                    one: resolverProps.one,
                    many: resolverProps.many,
                },
            };
            return ret;
        };

        let resolvers = [];

        for (const [key] of Object.entries(completeOptions.resolvers)) {
            const ressolverType = key as ResolverType;

            const crateResolverProps = generateResolversProps(ressolverType);

            if (crateResolverProps) {
                const buildResolversFunstion = this.crudBuilders[ressolverType];
                resolvers = _.concat(resolvers, buildResolversFunstion(crateResolverProps));
            }
        }

        return resolvers;
    }
}

export default CrudResolverBuilder;
