export type PkSchema<EntityT extends Entity> = {
  fields: (keyof EntityT)[];
  edges: (keyof EntityT['__edges__'])[];
  separator: string;
};

export type FieldsFromPk<EntityT extends Entity> = {
  fields: { [field in keyof EntityT]?: string };
  edges: { [edge in keyof EntityT['__edges__']]?: string };
};

export type SubRequest = {
  reducerName: string;
  requestId: string;
};

type Request = {
  id: string;
  timestamp: {
    created: {
      unixMilliseconds: number;
      formattedString?: string;
    };
    completed?: {
      unixMilliseconds: number;
      formattedString?: string;
    };
  };
  pending: boolean;
  entityPks?: string[];
  ok?: boolean;
  statusCode?: number;
  error?: string;
  subRequests?: SubRequest[];
};

export type EntityEdge<
  EntityNameT extends string,
  RelationType extends string[],
  RelationNameT extends string
> = {
  entity: EntityNameT;
  pks: RelationType;
  relationId?: RelationNameT;
};

export type Entity = {
  [fieldKey: string]: unknown;
  __edges__?: {
    [edgeName: string]:
      | EntityEdge<string, string[], string | never>
      | undefined;
  };
};

export type ReducerData<EntityT extends Entity> = {
  [entityPk: string]: EntityT;
};

export type ReducerPartialData<EntityT extends Entity> = {
  [entityPk: string]: Partial<
    Omit<EntityT, '__edges__'> & {
      __edges__?: Partial<EntityT['__edges__']>;
    }
  >;
};

export type ReducerMetadata = {
  [metadataKey: string]: unknown;
};

export type ReducerConfig = {
  completedRequestsCache?: number;
  requestsPrettyTimestamp?: {
    format: string;
    timezone: string;
  };
};

export type Reducer<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity
> = {
  requests: { [requestId: string]: Request };
  metadata: ReducerMetadataT;
  data: ReducerData<EntityT>;
  pkSchema: PkSchema<EntityT>;
  getPk: (entity: EntityT) => string;
  getFieldsFromPk: (pk: string) => FieldsFromPk<EntityT>;
  config: ReducerConfig;
};
