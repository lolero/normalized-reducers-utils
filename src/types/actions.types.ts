import {
  ReducerData,
  Entity,
  ReducerPartialData,
  SubRequest,
  ReducerMetadata,
  RequestMetadata,
} from './reducers.types';

export type RequestAction<
  ActionTypeT extends string,
  RequestMetadataT extends RequestMetadata,
> = {
  type: ActionTypeT;
  requestMetadata: RequestMetadataT;
  requestId: string;
};

export type SaveNothingAction<ActionTypeT extends string> = {
  type: ActionTypeT;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};

export type SaveWholeReducerMetadataAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
> = {
  type: ActionTypeT;
  wholeReducerMetadata: ReducerMetadataT;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};

export type SavePartialReducerMetadataAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
> = {
  type: ActionTypeT;
  partialReducerMetadata: Partial<ReducerMetadataT>;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};

export type SaveWholeEntitiesAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
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
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
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
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
> = {
  type: ActionTypeT;
  entityPks: string[];
  partialEntity: Partial<
    Omit<EntityT, '__edges__'> & {
      __edges__?: Partial<EntityT['__edges__']>;
    }
  >;
  partialReducerMetadata?: Partial<ReducerMetadataT>;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};

export type DeleteEntitiesAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
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
