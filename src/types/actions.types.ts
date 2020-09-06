import {
  ReducerData,
  Entity,
  ReducerPartialData,
  SubRequest,
  ReducerMetadata,
} from './reducers.types';

export type RequestMetadata = {
  [requestMetadataKey: string]: unknown;
};

export type RequestAction<
  ActionTypeT extends string,
  RequestMetadataT extends RequestMetadata,
  ReducerMetadataT extends ReducerMetadata
> = {
  type: ActionTypeT;
  requestMetadata?: RequestMetadataT;
  partialReducerMetadata?: Partial<ReducerMetadataT>;
  requestId: string;
};

export type SavePartialReducerMetadataAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata
> = {
  type: ActionTypeT;
  partialReducerMetadata: Partial<ReducerMetadataT>;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};

export type SaveWholeEntitiesAction<
  ActionTypeT extends string,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
> = {
  type: ActionTypeT;
  wholeEntities: ReducerData<EntityT>;
  partialReducerMetadata?: Partial<ReducerMetadataT>;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
  flush?: boolean;
};

export type SavePartialEntitiesAction<
  ActionTypeT extends string,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
> = {
  type: ActionTypeT;
  partialEntities: ReducerPartialData<EntityT>;
  partialReducerMetadata?: Partial<ReducerMetadataT>;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};

export type SavePartialPatternToEntitiesAction<
  ActionTypeT extends string,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
> = {
  type: ActionTypeT;
  entityPks: string[];
  partialEntity: Partial<EntityT>;
  partialReducerMetadata?: Partial<ReducerMetadataT>;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};

export type DeleteEntitiesAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata
> = {
  type: ActionTypeT;
  entityPks: string[];
  partialReducerMetadata?: Partial<ReducerMetadataT>;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};

export type FailAction<ActionTypeT extends string> = {
  type: ActionTypeT;
  error: string;
  requestId: string;
  statusCode?: number;
};
