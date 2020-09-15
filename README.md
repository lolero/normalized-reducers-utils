# normalized-reducers-utils

Utility functions and types for normalized reducers architectures

## Purpose

A set of standard protocols and interfaces to interact with a front-end state's
store, in order to make CRUD operations on the store consistent regardless of
the data that is being stored or consumed. In simple English, this package
provides the tools to interact with an application's front-end state in a
similar way to how client applications interact with a RESTful back-end API.

The framework is designed for Redux-like architectures where data is stored in
reducers and interactions with the stored data happen through actions that hit
the reducers.

## Introduction

The main structural advantage that building an application's state following
these normalized reducers pattern is that all the reducers of the application
will have the same fundamental structure, regardless of the type of data they
store. This makes all interactions with state data a standard and straight
forward task when the data corresponds to entities in a database, it is
metadata related to the presentational state of a component in the scope of
a session, or any other type for data for any use whatsoever.

Having a standard structure for the application state's store also facilitates
the migration of other data that often ends up in components' state, but could
or should be shared with other components from ONE single source of truth, as
opposed to getting passed between components through props and contexts.

Another important advantage of organizing the state in normalized reducers is
that asynchronous logic can be moved away from components' methods and hooks
to an isolated layer with the help of reliable frameworks like redux-saga. This
means that components get all the data they need for their rendering from their
connected props and their selectors. When a component requires additional data,
a synchronous action is dispatched to the store and the rendering of the
component is promptly completed. Not having asynchronous logic simplifies the
components' unit tests. Unit tests of components whose state does not depend on
promises waiting to get resolved are easier to read and understand, on top of
being more reliable and deterministic.

## Getting started

### Install

```shell script
$ npm install --save normalized-reducers-utils
```

or

```shell script
yarn add normalized-reducers-utils
```

## Configuration

### `successRequestsCache`

- Type: number | null
- Default: 10

Number of successfully completed requests to keep in the
[reducer's requests prop](#requests)

Set to `null` to keep all successfully completed requests.

### `failRequestsCache`

- Type: number | null
- Default: null

Number of failed requests to keep in the [reducer's requests prop](#requests)

Set to `null` to keep all failed requests.

### `requestsPrettyTimestamps`

- Type (optional):

```
{
  format: string;
  timezone: string;
}
```

- Default: undefined

Format of requests' formatted string timestamps.

## Basic concepts

### Normalized reducers

Normalized reducers are reducers that have the standard
[reducer](#reducer) object structure.

This structure is deliberately designed for reducers to store two kinds of
data.

Reducers can contain both types of data or only one of the two.

#### 1. Reducer metadata

Metadata about the reducer itself. This can be data related to the state of
the reducer, regarding the collection of entity data stored in the reducer,
or any other information not related to any particular single data entity.

#### 2. Entity data

Entity data, e.g. records from a back-end database table / collection

### Reducer props

#### `requests`

[Requests](#request) corresponding to [request actions](#requestaction) to
modify a reducer.

[Request actions](#requestaction) are actions with the `'__REQUEST'` suffix in
the action type.

When a
[request action](#requestaction) gets dispatched, a [request](#request) object
is added to the `requests` prop of the [reducer](#reducer).
[Requests](#request) are indexed by the `requestId` included in the
[request action](#requestaction) and contain the following props about the
requested CRUD operation that should be performed on the [reducer](#reducer).

- `id`: The `requestId` included in the [request action](#requestaction)
- `createdAt`: The timestamp at which the [request action](#requestaction) hits
  the reducer
  - `unixMilliseconds`: Milliseconds since the Unix epoch
  - `formattedString` (optional): Formatted timestamp according to the format
    passed in the reducer's [config](#reducerconfig) prop
- `completedAt`: The timestamp at which a success or [fail action](#failaction)
  with the [request action's](#requestaction) `requestId` hits the reducer
  - `unixMilliseconds`: Milliseconds since the Unix epoch
  - `formattedString` (optional): Formatted timestamp according to the format
    passed in the reducer's [config](#reducerconfig) prop
- `isPending`: Boolean flag set to `true` when the
  [request action](#requestaction) hits the reducer and to `false` when
  either a success or a [fail](#failaction) action with the
  [request action's](#requestaction) `requestId` does
- `requestMetadata`: The [request metadata](#requestmetadata) object passed
  with the [request action](#requestaction)
- `isOk` (optional): Boolean flag set to `true` when a success action with the
  [request action's](#requestaction) `requestId` hits the reducer or to
  `false` when a [fail action](#failaction) does
- `entityPks` (optional): String array with the primary keys of the
  [data entities](#2-entity-data) that get modified when a success action
  with the [request action's](#requestaction) `requestId` hits the reducer
- `statusCode` (optional): The status code in a success or a
  [fail](#failaction) action, with the [request action's](#requestaction)
  `requestId`, that hits the reducer
- `error` (optional): The error message in a [fail](#failaction) action, with
  the [request action's](#requestaction) `requestId`, that hits the reducer
- `subRequests` (optional): An array of [sub requests](#subrequest), triggered
  by the CRUD operation carried out as a result of the
  [request action](#requestaction)

#### `metadata`

The [reducer's metadata](#1-reducer-metadata) is a
[standard object with string keys](#reducermetadata).

#### `data`

The [reducer's entity data](#2-entity-data) is indexed by the entities's
primary key (PK).

An entity's PK is a concatenated string of the entity's props and/or its
`__edges__`'s props keys, as defined in the reducer's [PK schema](#pkschema).

#### `pkSchema` (prop)

The [PK schema](#pkschema) used to create the PK concatenated strings that
index the entities in the [reducer's data](#data) prop.

#### `getPk`

A function that takes an entity and returns the entity's PK

#### `destructPk`

A function that takes an entity's PK and returns a
[destructed entity PK](#destructedpk)

#### `config`

The [reducer configuration](#reducerconfig) object with all
[config params](#configuration).

## API

### Actions utils

#### `wasRequestSuccessful`

```typescript
function* wasRequestSuccessful(requestAction: {
  type: string;
  requestId: string;
}): boolean;
```

An effect to be placed in a saga that takes a [request action](#requestaction)
and waits for it to be completed

Example:

```typescript
function* fetchUser1AndThenUser2(): Generator<
  CallEffect | PutEffect,
  void,
  boolean
> {
  const getUser1RequestAction = usersCreateActionGetOneRequest('user-1');
  yield put(getUser1Action);

  const wasGetUser1ActionSuccessful = (yield call(
    wasRequestSuccessful,
    getUser1RequestAction,
  )) as boolean;
  if (!wasGetUser1ActionSuccessful) {
    console.error('failed to get user 1');
  }

  const getUser2RequestAction = usersCreateActionGetOneRequest('user-2');
  yield put(getUser2RequestAction);
}
```

### Initial state utils

#### `createInitialState`

```typescript
function createInitialState<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity
>(
  initialReducerMetadata: ReducerMetadataT,
  initialReducerData: ReducerData<EntityT>,
  pkSchema: PkSchema<EntityT>,
  config?: Partial<ReducerConfig>,
): Reducer<ReducerMetadataT, EntityT>;
```

A simple function that creates a typed initial state for a reducer.

The true value of this function is only exploited when called with generic
types.

#### `emptyPkSchema`

```typescript
const emptyPkSchema: PkSchema<Entity> = {
  fields: [],
  edges: [],
  separator: '',
};
```

An empty [PK schema](#pkschema-prop) to initialize reducers that don't store
entity data.

### Normalizer utils

#### `normalizeEntityArrayByPk`

```typescript
function normalizeEntityArrayByPk<EntityT extends Entity>(
  pkSchema: PkSchema<EntityT>,
  entityArray: EntityT[],
): ReducerData<EntityT>;
```

A simple function to convert an array of entities into an object, indexed by
the entities' PKs.

### Reducer handlers

An abstraction layer of utility functions that handle the manipulation of the
reducer's state for CRUD operations on reducer's metadata or on entity data.

The true value of these function is only exploited when called with generic
types.

Example:

```typescript
function UsersReducer(
  state: UsersReducer = usersInitialState,
  action: UsersReducerHittingAction,
): PairsReducer {
  switch (action.type) {
    case UsersActionTypes.USERS_GET_MANY__REQUEST:
      return handleRequest<
        UsersActionTypes.USERS_GET_MANY__REQUEST,
        UsersGetManyRequestMetadata,
        User,
        UsersReducer['metadata']
      >(state, action);
    case UsersActionTypes.USERS_GET_MANY__SUCCESS:
      return handleSaveWholeEntities<
        UsersActionTypes.USERS_GET_MANY__SUCCESS,
        User,
        UsersReducer['metadata']
      >(state, action);
    case UsersActionTypes.USERS_GET_MANY__FAIL:
      return handleFail<
        UsersActionTypes.USERS_GET_MANY__FAIL,
        User,
        UsersReducer['metadata']
      >(state, action);
    default:
      return state;
  }
}
```

#### `handleDeleteEntities`

```typescript
function handleDeleteEntities<
  ActionTypeT extends string,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: DeleteEntitiesAction<ActionTypeT, ReducerMetadataT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleFail`

```typescript
function handleFail<
  ActionTypeT extends string,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: FailAction<ActionTypeT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleRequest`

```typescript
function handleRequest<
  ActionTypeT extends string,
  RequestMetadataT extends RequestMetadata,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: RequestAction<ActionTypeT, RequestMetadataT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleSavePartialEntities`

```typescript
function handleSavePartialEntities<
  ActionTypeT extends string,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: SavePartialEntitiesAction<ActionTypeT, EntityT, ReducerMetadataT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleSavePartialPatternToEntities`

```typescript
function handleSavePartialPatternToEntities<
  ActionTypeT extends string,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: SavePartialPatternToEntitiesAction<
    ActionTypeT,
    EntityT,
    ReducerMetadataT
  >,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleSavePartialReducerMetadata`

```typescript
function handleSavePartialReducerMetadata<
  ActionTypeT extends string,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: SavePartialReducerMetadataAction<ActionTypeT, ReducerMetadataT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleSaveWholeEntities`

```typescript
function handleSaveWholeEntities<
  ActionTypeT extends string,
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: SaveWholeEntitiesAction<ActionTypeT, EntityT, ReducerMetadataT>,
): Reducer<ReducerMetadataT, EntityT>;
```

## Types

### Reducer types

#### `DestructedPk`

```typescript
type DestructedPk<EntityT extends Entity> = {
  fields: { [field in keyof EntityT]?: string };
  edges: { [edge in keyof EntityT['__edges__']]?: string };
};
```

#### `Entity`

```typescript
type Entity = {
  [fieldKey: string]: unknown;
  __edges__?: {
    [edgeName: string]:
      | EntityEdge<string, string[], string | never>
      | undefined;
  };
};
```

#### `EntityEdge`

```typescript
type EntityEdge<
  EntityNameT extends string,
  RelationType extends string[],
  RelationNameT extends string
> = {
  entity: EntityNameT;
  pks: RelationType;
  relationId?: RelationNameT;
};
```

#### `PkSchema`

```typescript
type PkSchema<EntityT extends Entity> = {
  fields: (keyof EntityT)[];
  edges: (keyof EntityT['__edges__'])[];
  separator: string;
};
```

#### `Reducer`

```typescript
type Reducer<
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
```

#### `ReducerConfig`

```typescript
type ReducerConfig = {
  successRequestsCache: number | null;
  failRequestsCache: number | null;
  requestsPrettyTimestamps?: {
    format: string;
    timezone: string;
  };
};
```

#### `ReducerData`

```typescript
type ReducerData<EntityT extends Entity> = {
  [entityPk: string]: EntityT;
};
```

#### `ReducerMetadata`

```typescript
type ReducerMetadata = {
  [metadataKey: string]: unknown;
};
```

#### `ReducerPartialData`

```typescript
type ReducerPartialData<EntityT extends Entity> = {
  [entityPk: string]: Partial<
    Omit<EntityT, '__edges__'> & {
      __edges__?: Partial<EntityT['__edges__']>;
    }
  >;
};
```

#### `Request`

```typescript
type Request = {
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
```

#### `RequestMetadata`

```typescript
type RequestMetadata = {
  [requestMetadataKey: string]: unknown;
};
```

#### `SubRequest`

```typescript
type SubRequest = {
  reducerName: string;
  requestId: string;
};
```

### Action types

#### `DeleteEntitiesAction`

```typescript
type DeleteEntitiesAction<
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
```

#### `FailAction`

```typescript
type FailAction<ActionTypeT extends string> = {
  type: ActionTypeT;
  error: string;
  requestId: string;
  statusCode?: number;
};
```

#### `RequestAction`

```typescript
type RequestAction<
  ActionTypeT extends string,
  RequestMetadataT extends RequestMetadata
> = {
  type: ActionTypeT;
  requestMetadata: RequestMetadataT;
  requestId: string;
};
```

#### `SavePartialEntitiesAction`

```typescript
type SavePartialEntitiesAction<
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
```

#### `SavePartialPatternToEntitiesAction`

```typescript
type SavePartialPatternToEntitiesAction<
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
```

#### `SavePartialReducerMetadataAction`

```typescript
type SavePartialReducerMetadataAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata
> = {
  type: ActionTypeT;
  partialReducerMetadata: Partial<ReducerMetadataT>;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};
```

#### `SaveWholeEntitiesAction`

```typescript
type SaveWholeEntitiesAction<
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
```
