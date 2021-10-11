export type PkSchemaFields<EntityT extends Entity> = Exclude<
  keyof EntityT,
  '__edges__'
>[];

export type PkSchemaEdges<EntityT extends Entity> =
  (keyof EntityT['__edges__'])[];

export type PkSchema<
  EntityT extends Entity,
  FieldsT extends PkSchemaFields<EntityT>,
  EdgesT extends PkSchemaEdges<EntityT>,
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
  >,
> = {
  fields: { [field in PkSchemaT['fields'][number]]: string };
  edges: { [edge in PkSchemaT['edges'][number]]: EntityT['__edges__'][edge] };
};

export type SubRequest = {
  reducerName: string;
  requestId: string;
};

export type RequestMetadata = {
  [requestMetadataKey: string]: unknown;
};

export type Request<RequestMetadataT extends RequestMetadata> = {
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
  metadata: RequestMetadataT;
  isOk?: boolean;
  entityPks?: string[];
  statusCode?: number;
  error?: string;
  subRequests?: SubRequest[];
};

export type Entity = {
  [fieldKey: string]: unknown;
  __edges__?: {
    [edgeName: string]: string[] | null;
  };
};

export enum EdgeSide {
  slave,
  master,
}

export type ReducerEdgeTypeMetadata = {
  nodeReducerPath: readonly string[];
  edgeReducerPath: readonly string[] | null;
};

export type ReducerEdge<
  NodeReducerPathT extends ReducerEdgeTypeMetadata['nodeReducerPath'],
  EdgeReducerPathT extends ReducerEdgeTypeMetadata['edgeReducerPath'] | null,
> = {
  nodeReducerPath: NodeReducerPathT;
  edgeReducerPath?: EdgeReducerPathT;
  edgeSide?: EdgeSide;
};

export type ReducerEdgesTypeMetadata<EntityT extends Entity> = {
  [edgeName in keyof EntityT['__edges__']]: ReducerEdgeTypeMetadata;
};

export type ReducerEdges<
  EntityT extends Entity,
  ReducerEdgesTypeMetadataT extends ReducerEdgesTypeMetadata<EntityT>,
> = {
  [edgeName in keyof EntityT['__edges__']]: ReducerEdge<
    ReducerEdgesTypeMetadataT[keyof EntityT['__edges__']]['nodeReducerPath'],
    ReducerEdgesTypeMetadataT[keyof EntityT['__edges__']]['edgeReducerPath']
  >;
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
> = {
  requests: { [requestId: string]: Request<RequestMetadata> };
  metadata: ReducerMetadataT;
  data: ReducerData<EntityT>;
  config: ReducerConfig;
};

export type ReducerGroup<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  ReducerPathT extends string[],
> = {
  [reducerOrGroup in ReducerPathT[number]]?:
    | Reducer<ReducerMetadataT, EntityT>
    | ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>;
};
