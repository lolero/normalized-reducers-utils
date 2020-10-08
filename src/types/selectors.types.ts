import { OutputSelector } from 'reselect';
import {
  Entity,
  Reducer,
  ReducerEdges,
  ReducerGroup,
  ReducerMetadata,
} from './reducers.types';

export type ReducerSelectors<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  ReduxState extends ReducerGroup<ReducerMetadataT, EntityT>
> = {
  selectRequests: OutputSelector<
    ReduxState,
    Reducer<ReducerMetadataT, EntityT>['requests'],
    (
      res: Reducer<ReducerMetadataT, EntityT>,
    ) => Reducer<ReducerMetadataT, EntityT>['requests']
  >;
  selectMetadata: OutputSelector<
    ReduxState,
    Reducer<ReducerMetadataT, EntityT>['metadata'],
    (
      res: Reducer<ReducerMetadataT, EntityT>,
    ) => Reducer<ReducerMetadataT, EntityT>['metadata']
  >;
  selectData: OutputSelector<
    ReduxState,
    Reducer<ReducerMetadataT, EntityT>['data'],
    (
      res: Reducer<ReducerMetadataT, EntityT>,
    ) => Reducer<ReducerMetadataT, EntityT>['data']
  >;
  selectConfig: OutputSelector<
    ReduxState,
    Reducer<ReducerMetadataT, EntityT>['config'],
    (
      res: Reducer<ReducerMetadataT, EntityT>,
    ) => Reducer<ReducerMetadataT, EntityT>['config']
  >;
};
