import {
  ReducerData,
  Entity,
  ReducerPartialData,
  RequestMetadata,
} from './reducers.types';

export interface CreateOneRequestMetadata<EntityT extends Entity>
  extends RequestMetadata {
  entity: EntityT;
}

export interface GetOneRequestMetadata extends RequestMetadata {
  entityPk: string;
}

export interface GetManyRequestMetadata extends RequestMetadata {
  entityPks?: string[];
}

export interface UpdateOneWholeRequestMetadata<EntityT extends Entity>
  extends RequestMetadata {
  entityPk: string;
  entity: EntityT;
}

export interface UpdateManyWholeRequestMetadata<EntityT extends Entity>
  extends RequestMetadata {
  wholeEntities: ReducerData<EntityT>;
}

export interface UpdateOnePartialRequestMetadata<EntityT extends Entity>
  extends RequestMetadata {
  entityPk: string;
  partialEntity: Partial<EntityT>;
}

export interface UpdateManyPartialRequestMetadata<EntityT extends Entity>
  extends RequestMetadata {
  partialEntities: ReducerPartialData<EntityT>;
}

export interface DeleteOneRequestMetadata extends RequestMetadata {
  entityPk: string;
}

export interface DeleteManyRequestMetadata extends RequestMetadata {
  entityPks: string[];
}
