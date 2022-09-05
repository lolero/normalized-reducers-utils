import { Entity, Reducer, ReducerMetadata } from '../types/reducers.types';

/**
 * Selects reducer prop.
 *
 * @param {Reducer} reducer - The path to the reducer in the redux state
 * @param {reducerPropKey} reducerPropKey - The key of the reducer prop being
 *        selected
 * @returns {object} Reducer prop
 */
export function selectReducerProp<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  ReducerPropKey extends keyof Reducer<ReducerMetadataT, EntityT>,
>(
  reducer: Reducer<ReducerMetadataT, EntityT>,
  reducerPropKey: ReducerPropKey,
): Reducer<ReducerMetadataT, EntityT>[ReducerPropKey] {
  return reducer[reducerPropKey];
}
