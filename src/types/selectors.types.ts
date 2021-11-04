import {
  Entity,
  Reducer,
  ReducerGroup,
  ReducerMetadata,
} from './reducers.types';

export type ReducerSelectors<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  ReducerPathT extends string[],
  ReduxState extends ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>,
> = {
  selectRequests: (
    state: ReduxState,
  ) => Reducer<ReducerMetadataT, EntityT>['requests'];
  selectMetadata: (
    state: ReduxState,
  ) => Reducer<ReducerMetadataT, EntityT>['metadata'];
  selectData: (state: ReduxState) => Reducer<ReducerMetadataT, EntityT>['data'];
  selectConfig: (
    state: ReduxState,
  ) => Reducer<ReducerMetadataT, EntityT>['config'];
};
