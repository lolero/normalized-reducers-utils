import {
  Reducer,
  PkSchema,
  Entity,
  ReducerMetadata,
  ReducerData,
  ReducerConfig,
} from '../types/reducers.types';
import { getFieldsFromPk, getPkOfEntity } from './pk.utils';

export const emptyGenericPkSchema: PkSchema<Entity> = {
  fields: [],
  edges: [],
  separator: '',
};

export const defaultReducerConfig: ReducerConfig = {};

/**
 * Creates initial state of normalized reducer
 *
 * @param {ReducerMetadata} initialReducerMetadata - Initial reducer metadata
 * @param {ReducerData} initialReducerData - Initial reducer data
 * @param {PkSchema} pkSchema - PK schema of normalized reducer entities
 * @param {ReducerConfig} [config] - Custom config params
 *
 * @returns {Reducer} Normalized reducer initial state
 */
export function createInitialState<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity
>(
  initialReducerMetadata: ReducerMetadataT,
  initialReducerData: ReducerData<EntityT>,
  pkSchema: PkSchema<EntityT>,
  config?: Partial<ReducerConfig>,
): Reducer<ReducerMetadataT, EntityT> {
  const reducerInitialState: Reducer<ReducerMetadataT, EntityT> = {
    requests: {},
    metadata: initialReducerMetadata,
    data: initialReducerData,
    pkSchema,
    getPk: (entity): string => getPkOfEntity(entity, pkSchema),
    getFieldsFromPk: (pk) => getFieldsFromPk(pk, pkSchema),
    config: {
      ...defaultReducerConfig,
      ...config,
    },
  };

  return reducerInitialState;
}
