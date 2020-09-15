import {
  Reducer,
  PkSchema,
  Entity,
  ReducerMetadata,
  ReducerData,
  ReducerConfig,
} from '../types/reducers.types';
import { destructPk, getPkOfEntity } from './pk.utils';

export const emptyPkSchema: PkSchema<Entity> = {
  fields: [],
  edges: [],
  separator: '',
};

export const defaultReducerConfig: ReducerConfig = {
  successRequestsCache: 10,
  failRequestsCache: null,
};

/**
 * Creates initial state of reducer
 *
 * @param {ReducerMetadata} initialReducerMetadata - Initial reducer metadata
 * @param {ReducerData} initialReducerData - Initial reducer data
 * @param {PkSchema} pkSchema - PK schema of reducer's entities
 * @param {ReducerConfig} [config] - Custom config params
 *
 * @returns {Reducer} Reducer's initial state
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
    destructPk: (pk) => destructPk(pk, pkSchema),
    config: {
      ...defaultReducerConfig,
      ...config,
    },
  };

  return reducerInitialState;
}
