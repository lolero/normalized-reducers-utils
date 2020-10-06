export type PkSchemaFields<EntityT extends Entity> = (keyof EntityT)[];

export type PkSchemaEdges<
  EntityT extends Entity
> = (keyof EntityT['__edges__'])[];

export type PkSchema<
  EntityT extends Entity,
  FieldsT extends PkSchemaFields<EntityT>,
  EdgesT extends PkSchemaEdges<EntityT>
> = {
  fields: FieldsT;
  edges: EdgesT;
  separator: string;
  subSeparator: string;
};

export type DestructedPk<
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
> = {
  fields: { [field in PkSchemaT['fields'][number]]: string };
  edges: { [edge in PkSchemaT['edges'][number]]: string[] };
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
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
> = {
  requests: { [requestId: string]: Request };
  metadata: ReducerMetadataT;
  data: ReducerData<EntityT>;
  pkSchema: PkSchemaT;
  getPk: (entity: EntityT) => string;
  destructPk: (pk: string) => DestructedPk<EntityT, PkSchemaT>;
  config: ReducerConfig;
};
