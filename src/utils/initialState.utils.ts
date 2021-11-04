import {
  Entity,
  Reducer,
  ReducerConfig,
  ReducerData,
  ReducerMetadata,
} from '../types/reducers.types';

export const defaultReducerConfig: ReducerConfig = {
  successRequestsCache: 10,
  failRequestsCache: null,
};

/**
 * Creates initial state of reducer.
 * The 'EntityT' generic type required by this function is not inferred from
 * the function's arguments when 'initialReducerData' is an empty object,
 * therefore it is recommended that consumers declare the function's generic
 * types explicitly in function calls.
 *
 * @param {ReducerMetadata} initialReducerMetadata - Initial reducer metadata
 * @param {ReducerData} initialReducerData - Initial reducer data
 * @param {ReducerConfig} [config] - Custom config params
 * @returns {Reducer} Reducer's initial state
 */
export function createInitialState<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
>(
  initialReducerMetadata: ReducerMetadataT,
  initialReducerData: ReducerData<EntityT>,
  config?: Partial<ReducerConfig>,
): Reducer<ReducerMetadataT, EntityT> {
  const reducerInitialState: Reducer<ReducerMetadataT, EntityT> = {
    requests: {},
    metadata: initialReducerMetadata,
    data: initialReducerData,
    config: {
      ...defaultReducerConfig,
      ...config,
    },
  };

  return reducerInitialState;
}
