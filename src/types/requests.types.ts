import {
  ReducerData,
  Entity,
  ReducerPartialData,
  RequestMetadata,
  ReducerEdges,
  ReducerMetadata,
} from './reducers.types';

export interface UpdatePartialReducerMetadataRequestMetadata<
  ReducerMetadataT extends ReducerMetadata
> extends RequestMetadata {
  partialReducerMetadata: Partial<ReducerMetadataT>;
}

export interface CreateOneEntityRequestMetadata<
  EntityT extends Entity<ReducerEdges>
> extends RequestMetadata {
  entity: EntityT;
}

export interface CreateManyEntitiesRequestMetadata<
  EntityT extends Entity<ReducerEdges>
> extends RequestMetadata {
  wholeEntities: ReducerData<EntityT>;
}

export interface GetOneEntityRequestMetadata extends RequestMetadata {
  entityPk: string;
}

export interface GetManyEntitiesRequestMetadata extends RequestMetadata {
  entityPks?: string[];
}

export interface UpdateOneWholeEntityRequestMetadata<
  EntityT extends Entity<ReducerEdges>
> extends RequestMetadata {
  entityPk: string;
  entity: EntityT;
}

export interface UpdateManyWholeEntitiesRequestMetadata<
  EntityT extends Entity<ReducerEdges>
> extends RequestMetadata {
  wholeEntities: ReducerData<EntityT>;
}

export interface UpdateOnePartialEntityRequestMetadata<
  EntityT extends Entity<ReducerEdges>
> extends RequestMetadata {
  entityPk: string;
  partialEntity: Partial<EntityT>;
}

export interface UpdateManyPartialEntitiesRequestMetadata<
  EntityT extends Entity<ReducerEdges>
> extends RequestMetadata {
  partialEntities: ReducerPartialData<EntityT>;
}

export interface DeleteOneEntityRequestMetadata extends RequestMetadata {
  entityPk: string;
}

export interface DeleteManyEntitiesRequestMetadata extends RequestMetadata {
  entityPks: string[];
}
