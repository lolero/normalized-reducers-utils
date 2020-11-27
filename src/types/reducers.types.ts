export type PkSchemaFields<EntityT extends Entity<ReducerEdges>> = Exclude<
  keyof EntityT,
  '__edges__'
>[];

export type PkSchemaEdges<
  EntityT extends Entity<ReducerEdges>
> = (keyof EntityT['__edges__'])[];

export type PkSchema<
  EntityT extends Entity<ReducerEdges>,
  FieldsT extends PkSchemaFields<EntityT>,
  EdgesT extends PkSchemaEdges<EntityT>
> = {
  fields: FieldsT;
  edges: EdgesT;
  separator: string;
  subSeparator: string;
};

export type DestructedPk<
  EntityT extends Entity<ReducerEdges>,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
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

export enum EdgeSide {
  slave,
  master,
}

export type ReducerEdge = {
  nodeReducerPath: string[];
  edgeReducerPath?: string[];
  edgeSide?: EdgeSide;
};

export type ReducerEdges = {
  [edgeName: string]: ReducerEdge;
};

export type Entity<ReducerEdgesT extends ReducerEdges> = {
  [fieldKey: string]: unknown;
  __edges__?: {
    [edgeName in keyof ReducerEdgesT]: string[] | null;
  };
};

export type ReducerData<EntityT extends Entity<ReducerEdges>> = {
  [entityPk: string]: EntityT;
};

export type ReducerPartialData<EntityT extends Entity<ReducerEdges>> = {
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
  EntityT extends Entity<ReducerEdges>
> = {
  requests: { [requestId: string]: Request };
  metadata: ReducerMetadataT;
  data: ReducerData<EntityT>;
  config: ReducerConfig;
};

export type ReducerGroup<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  ReducerPathT extends string[]
> = {
  [reducerOrGroup in ReducerPathT[number]]?:
    | Reducer<ReducerMetadataT, EntityT>
    | ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>;
};
