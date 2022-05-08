import { Entity, Reducer, ReducerMetadata } from './reducers.types';

export type ReducerHooks<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
> = {
  useRequest: (
    requestId: string,
  ) => Reducer<ReducerMetadataT, EntityT>['requests'][string] | undefined;
  useRequests: (
    requestIds?: string[],
  ) => Partial<Reducer<ReducerMetadataT, EntityT>['requests']>;
  useReducerMetadata: () => Reducer<ReducerMetadataT, EntityT>['metadata'];
  useEntity: (
    entityPk: string,
  ) => Reducer<ReducerMetadataT, EntityT>['data'][string] | undefined;
  useEntities: (
    entityPks?: string[],
  ) => Partial<Reducer<ReducerMetadataT, EntityT>['data']>;
  useReducerConfig: () => Reducer<ReducerMetadataT, EntityT>['config'];
};
