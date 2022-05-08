import { last } from 'lodash';
import { createSelector } from 'reselect';
import {
  Entity,
  Reducer,
  ReducerGroup,
  ReducerMetadata,
} from '../types/reducers.types';
import { ReducerSelectors } from '../types/selectors.types';
import { selectReducerProp } from './selectors';

/**
 * Creates a selector for a given reducer prop.
 *
 * @param {string[]} reducerPath - The path to the reducer in the redux state
 *        object
 * @param {keyof Reducer} reducerPropKey - The key of the reducer prop for
 *        which the selector is created
 * @returns {Function} Selector for the reducer props
 */
export function createReducerPropSelector<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  ReducerPathT extends string[],
  ReduxState extends ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>,
  ReducerPropKey extends keyof Reducer<ReducerMetadataT, EntityT>,
>(
  reducerPath: ReducerPathT,
  reducerPropKey: ReducerPropKey,
): (state: ReduxState) => Reducer<ReducerMetadataT, EntityT>[ReducerPropKey] {
  const selector = createSelector(
    [
      (state: ReduxState) => {
        let reducerGroup: ReducerGroup<
          ReducerMetadataT,
          EntityT,
          ReducerPathT
        > = state;
        reducerPath
          .slice(0, reducerPath.length - 1)
          .forEach((reducerGroupName) => {
            reducerGroup = reducerGroup[
              reducerGroupName as keyof typeof reducerGroup
            ] as ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>;
          });
        const reducer = reducerGroup[
          last(reducerPath) as keyof typeof reducerGroup
        ] as Reducer<ReducerMetadataT, EntityT>;

        return reducer;
      },
    ],
    (reducer) => selectReducerProp(reducer, reducerPropKey),
  ) as unknown as (
    state: ReduxState,
  ) => Reducer<ReducerMetadataT, EntityT>[ReducerPropKey];

  return selector;
}

/**
 * Creates selectors for the reducer's props.
 *
 * @param {string[]} reducerPath - The path to the reducer in the redux state
 *        object
 * @returns {ReducerSelectors} Selectors for the reducer's props
 */
export function createReducerSelectors<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  ReducerPathT extends string[],
  ReduxState extends ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>,
>(
  reducerPath: ReducerPathT,
): ReducerSelectors<ReducerMetadataT, EntityT, ReducerPathT, ReduxState> {
  const reducerSelectors: ReducerSelectors<
    ReducerMetadataT,
    EntityT,
    ReducerPathT,
    ReduxState
  > = {
    selectRequests: createReducerPropSelector<
      ReducerMetadataT,
      EntityT,
      ReducerPathT,
      ReduxState,
      'requests'
    >(reducerPath, 'requests'),
    selectMetadata: createReducerPropSelector<
      ReducerMetadataT,
      EntityT,
      ReducerPathT,
      ReduxState,
      'metadata'
    >(reducerPath, 'metadata'),
    selectData: createReducerPropSelector<
      ReducerMetadataT,
      EntityT,
      ReducerPathT,
      ReduxState,
      'data'
    >(reducerPath, 'data'),
    selectConfig: createReducerPropSelector<
      ReducerMetadataT,
      EntityT,
      ReducerPathT,
      ReduxState,
      'config'
    >(reducerPath, 'config'),
  };

  return reducerSelectors;
}
