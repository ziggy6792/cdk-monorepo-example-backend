/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */

import _ from 'lodash';
import Creatable from 'src/domain/models/abstract/creatable';
import { Multiplicity, IOneResProps, IManyResProps, IBuildResolverProps, ResolverType, CrudBuilders, ICompleteCrudProps, IBuildCrudProps } from './types';

const defaultResolverProps = {
    middleware: [],
};

const buildCrudPropsToCompleteCrudProps = (buildCrudProps: IBuildCrudProps): ICompleteCrudProps => {
    const completeCrudProps: Partial<ICompleteCrudProps> = {};

    completeCrudProps.idFields = buildCrudProps.idFields || ['id'];

    completeCrudProps.crudProps = {};

    Object.keys(buildCrudProps.crudProps).forEach((resolverType: ResolverType) => {
        const { resolverProps } = buildCrudProps.crudProps[resolverType];

        completeCrudProps.crudProps[resolverType] = {
            inputType: buildCrudProps.crudProps[resolverType].inputType,
            resolvers: [],
        };

        const oneProps = resolverProps as IOneResProps;
        if (oneProps.one) {
            const passedInProps = oneProps.one === true ? {} : oneProps.one;
            completeCrudProps.crudProps[resolverType].resolvers.push({ ...defaultResolverProps, ...passedInProps, multiplicityType: Multiplicity.ONE });
        }
        const manyProps = resolverProps as IManyResProps;
        if (manyProps.many) {
            const passedInProps = manyProps.many === true ? {} : manyProps.many;
            completeCrudProps.crudProps[resolverType].resolvers.push({ ...defaultResolverProps, ...passedInProps, multiplicityType: Multiplicity.MANY });
        }
    });
    return completeCrudProps as ICompleteCrudProps;
};

class CrudResolverBuilder {
    private crudBuilders: CrudBuilders;

    constructor(crudBuilders: CrudBuilders) {
        this.crudBuilders = crudBuilders;
    }

    public buildCrudResolvers(suffix: string, returnType: typeof Creatable, createCrudOptions: IBuildCrudProps): any[] {
        const completeCrudProps = buildCrudPropsToCompleteCrudProps(createCrudOptions);

        const generateBuildResolversProps = (resolverType: ResolverType): IBuildResolverProps | null => {
            if (!completeCrudProps.crudProps[resolverType]) {
                return null;
            }
            const ret: IBuildResolverProps = {
                suffix,
                returnType,
                idFields: completeCrudProps.idFields,
                inputType: completeCrudProps.crudProps[resolverType].inputType,
                resolversToBuild: completeCrudProps.crudProps[resolverType].resolvers,
            };
            return ret;
        };

        let resolvers = [];

        Object.keys(completeCrudProps.crudProps).forEach((resolverType: ResolverType) => {
            const buildResolverProps = generateBuildResolversProps(resolverType);

            if (buildResolverProps) {
                const buildFunstion = this.crudBuilders[resolverType];
                resolvers = _.concat(resolvers, buildFunstion(buildResolverProps));
            }
        });

        return resolvers;
    }
}

export default CrudResolverBuilder;
