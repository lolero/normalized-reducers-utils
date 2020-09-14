export type PkSchema<EntityT extends Entity> = {
  fields: (keyof EntityT)[];
  edges: (keyof EntityT['__edges__'])[];
  separator: string;
};

export type DestructedPk<EntityT extends Entity> = {
  fields: { [field in keyof EntityT]?: string };
  edges: { [edge in keyof EntityT['__edges__']]?: string };
};

export type SubRequest = {
  reducerName: string;
  requestId: string;
};

export type RequestMetadata = {
  [requestMetadataKey: string]: unknown;
};

export type Request = {
  id: string;
  createdAt: {
    unixMilliseconds: number;
    formattedString?: string;
  };
  completedAt?: {
    unixMilliseconds: number;
    formattedString?: string;
  };
  isPending: boolean;
  metadata: RequestMetadata;
  isOk?: boolean;
  entityPks?: string[];
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
  successRequestsCache: number | null;
  failRequestsCache: number | null;
  requestsPrettyTimestamps?: {
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
  destructPk: (pk: string) => DestructedPk<EntityT>;
  config: ReducerConfig;
};
