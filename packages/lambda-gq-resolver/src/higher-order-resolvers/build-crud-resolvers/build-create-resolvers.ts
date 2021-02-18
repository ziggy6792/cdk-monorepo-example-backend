/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import pluralize from 'pluralize';
import _ from 'lodash';
import { createNotExistsCondition, mapDbException } from 'src/utils/utility';
import { IBuildResolversProps, Multiplicity } from './types';

export function buildCreateResolvers(buildResolversProps: IBuildResolversProps) {
    const { suffix, returnType, resolverBuildProps, idFields, inputType } = buildResolversProps;

    const createEntity = async (entity: any) => {
        try {
            const createdEntity = await mapper.put(entity, { condition: createNotExistsCondition(idFields) });
            return createdEntity;
        } catch (err) {
            const keys = _.pickBy(entity, (value, key) => idFields.includes(key));
            throw mapDbException(err, `${suffix} ${JSON.stringify(keys)} already exists`);
        }
    };

    const resolvers = resolverBuildProps.map((props) => {
        const { middleware } = props;

        if (props.multiplicityType === Multiplicity.ONE) {
            @Resolver()
            class CreateOneResolver {
                @Mutation(() => returnType, { name: `create${suffix}` })
                @UseMiddleware(...(middleware || []))
                async create(@Arg('input', () => inputType) input: any) {
                    const entity = Object.assign(new returnType(), input);
                    const createdEntity = await createEntity(entity);
                    return createdEntity;
                }
            }
            return CreateOneResolver;
        }
        if (props.multiplicityType === Multiplicity.MANY) {
            @Resolver()
            class CreateManyResolver {
                @Mutation(() => [returnType], { name: `create${pluralize.plural(suffix)}` })
                @UseMiddleware(...(middleware || []))
                async create(@Arg('input', () => [inputType]) inputs: any[]) {
                    const entities = inputs.map((input) => Object.assign(new returnType(), input));
                    const createFns = entities.map((entity) => async () => createEntity(entity));
                    const createdEnties = await Promise.all(createFns.map((fn) => fn()));
                    return createdEnties;
                }
            }
            return CreateManyResolver;
        }
        throw new Error('This can never happen');
    });

    return resolvers;
}
