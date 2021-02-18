/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */

import _ from 'lodash';
import { Multiplicity, IOneResProps, IManyResProps, IBuildResolversProps, ResolverType, CrudBuilders, ICompleteCrudProps, IBuildCrudProps } from './types';

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

    public buildCrudResolvers(suffix: string, returnType: any, createCrudOptions: IBuildCrudProps): any[] {
        // const completeOptions = applyDefaults(createCrudOptions);

        const completeCrudProps = buildCrudPropsToCompleteCrudProps(createCrudOptions);

        const generateResolversProps = (resolverType: ResolverType): IBuildResolversProps | null => {
            if (!completeCrudProps.crudProps[resolverType]) {
                return null;
            }
            const ret: IBuildResolversProps = {
                suffix,
                returnType,
                idFields: completeCrudProps.idFields,
                inputType: completeCrudProps.crudProps[resolverType].inputType,
                resolverBuildProps: completeCrudProps.crudProps[resolverType].resolvers,
            };
            return ret;
        };

        let resolvers = [];

        Object.keys(completeCrudProps.crudProps).forEach((resolverType: ResolverType) => {
            const crateResolverProps = generateResolversProps(resolverType);

            if (crateResolverProps) {
                const buildResolversFunstion = this.crudBuilders[resolverType];
                resolvers = _.concat(resolvers, buildResolversFunstion(crateResolverProps));
            }
        });

        return resolvers;
    }
}

export default CrudResolverBuilder;
