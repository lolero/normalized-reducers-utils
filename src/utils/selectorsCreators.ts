import { last } from 'lodash';
import { createSelector, OutputSelector } from 'reselect';
import {
  Entity,
  Reducer,
  ReducerEdges,
  ReducerGroup,
  ReducerMetadata,
} from '../types/reducers.types';
import { ReducerSelectors } from '../types/selectors.types';
import { selectReducerProp } from './selectors';

/**
 * Creates a selector for a given reducer prop.
 *
 * @param {string[]} pathToReducer - The path to the reducer in the redux state
 *        object
 * @param {keyof Reducer} reducerPropKey - The key of the reducer prop for
 *        which the selector is created
 *
 * @returns {OutputSelector} Selector for the reducer props
 */
export function createReducerPropSelector<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  ReduxState extends ReducerGroup<ReducerMetadataT, EntityT>,
  ReducerPropKey extends keyof Reducer<ReducerMetadataT, EntityT>
>(
  pathToReducer: string[],
  reducerPropKey: ReducerPropKey,
): OutputSelector<
  ReduxState,
  Reducer<ReducerMetadataT, EntityT>[ReducerPropKey],
  (
    res: Reducer<ReducerMetadataT, EntityT>,
  ) => Reducer<ReducerMetadataT, EntityT>[ReducerPropKey]
> {
  const selector = createSelector(
    (state: ReduxState) => {
      let reducerGroup: ReducerGroup<ReducerMetadataT, EntityT> = state;
      pathToReducer
        .slice(0, pathToReducer.length - 1)
        .forEach((reducerGroupName) => {
          reducerGroup = reducerGroup[reducerGroupName] as ReducerGroup<
            ReducerMetadataT,
            EntityT
          >;
        });
      const reducer = reducerGroup[last(pathToReducer) as string] as Reducer<
        ReducerMetadataT,
        EntityT
      >;

      return reducer;
    },
    (reducer) => selectReducerProp(reducer, reducerPropKey),
  );

  return selector;
}

/**
 * Creates selectors for the reducer's props.
 *
 * @param {string[]} pathToReducer - The path to the reducer in the redux state
 *        object
 *
 * @returns {ReducerSelectors} Selectors for the reducer's props
 */
export function createReducerSelectors<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  ReduxState extends ReducerGroup<ReducerMetadataT, EntityT>
>(
  pathToReducer: string[],
): ReducerSelectors<ReducerMetadataT, EntityT, ReduxState> {
  const reducerSelectors: ReducerSelectors<
    ReducerMetadataT,
    EntityT,
    ReduxState
  > = {
    selectRequests: createReducerPropSelector<
      ReducerMetadataT,
      EntityT,
      ReduxState,
      'requests'
    >(pathToReducer, 'requests'),
    selectMetadata: createReducerPropSelector<
      ReducerMetadataT,
      EntityT,
      ReduxState,
      'metadata'
    >(pathToReducer, 'metadata'),
    selectData: createReducerPropSelector<
      ReducerMetadataT,
      EntityT,
      ReduxState,
      'data'
    >(pathToReducer, 'data'),
    selectConfig: createReducerPropSelector<
      ReducerMetadataT,
      EntityT,
      ReduxState,
      'config'
    >(pathToReducer, 'config'),
  };

  return reducerSelectors;
}
