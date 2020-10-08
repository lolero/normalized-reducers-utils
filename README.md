# normalized-reducers-utils

Utility functions and types for normalized reducers architectures

## Purpose

1. A standard protocol to interact with an application's front-end state in
   order to make CRUD operations on it consistent, regardless of the data that
   is being stored or consumed. In simple English, this package provides the
   tools to interact with the state in a similar way to how clients interact
   with a RESTful API.

2. A set of strongly typed CRUD action interfaces and reducer handlers that
   enforce a consistent reducer architecture which allows for the robust and
   reliable scaling of a web application.

3. A framework that simplifies the migration of async logic away from
   components and into a dedicated layer of redux middleware.

The framework is designed for [redux](https://redux.js.org)-like architectures
where data is stored in reducers and interactions with the stored data happen
through actions that get dispatched and hit the reducers.

## Motivation

Many millions of applications with broad ranges of size, complexity and
popularity are getting built today with [React](https://reactjs.org) and
[Redux](https://redux.js.org) because they are the most popular frameworks for
that purpose. Unfortunately, there is little consistency in the reducer
architecture across the vast ocean of projects that include them in their
stack. App state configurations and interaction protocols vary as much as or
more than the apps' purposes and business logic.

Many of these projects are so busy sorting out features and aesthetics that
they don't allocate much time to addressing the scalabity of their state's
design, or the handling of asynchronous logic such as pending AJAX calls to
remote APIs.

As the amount and complexity of the app's features grow, their maintenance and
scaling becomes increasingly more expensive and cumbersome. This is a result of
a growing amount of reducers with a variety of structures for their respective
purposes, as well as the non standardized handling of an increasing number of
async calls to RESTful servers for a variety of data that the app requires.

This project started while refactoring an app that consumes many related
entities from their respective microservices and presents their data in a web
interface. As more entities were added to the application, maintaining the
reducers that stored their data and the actions that modified them became very
inefficient. What's more, the scattered promises that handled the fetching of
the entities, sometimes in component's methods and others in redux middleware
or custom service classes, made the management and tracking of the ongoing
calls difficult to follow and debug. Then, after cleaning up the state and
migrating all async logic to a dedicated layer in redux middleware, the
benefits of a standard reducer structure and reducer-hitting actions became
evident and this set of generic types and functions began to come together
as an underlying architecture for scalable react-redux applications.

A standard structure for all reducers and the interactions with them
simplifies their maintenance. On the other hand, the normalization of reducers
that store entity data simplifies the access-to and control-of both the
entities and the relationships between them. Naturally, this results in the
ability to better scale the state, regardless of the type of data that is
stored and managed in it; be it data entities stored in a database, metadata
related to the presentational state of a component in the scope of a session,
or any other type of data for any use whatsoever.

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

The initial state of a reducer is created by calling the
[createInitialState](#createinitialstate) function which takes an optional
[config](#reducerconfig) object with the following props.

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

Normalized reducers are reducers that have the standard [reducer](#reducer)
object structure.

This structure is deliberately designed for reducers to store two kinds of
data.

Reducers can contain both types of data or only one of the two.

#### 1. Reducer metadata

Metadata about the reducer itself. This can be data related to the state of
the reducer, regarding the collection of [entity data](#2-entity-data) stored
in the reducer, or any other information not related to any particular single
data entity.

#### 2. Entity data

Entity data, e.g. records from a back-end database table / collection

### Reducer props

#### `requests`

[Requests](#request) corresponding to [request actions](#requestaction) to
modify a reducer.

[Request actions](#requestaction) are actions with the `'__REQUEST'` suffix in
the action type.

When a [request action](#requestaction) gets dispatched, a [request](#request)
object is added to the `requests` prop of the [reducer](#reducer).
[Requests](#request) are indexed by the `requestId` included in the
[request action](#requestaction) and contain the following props about the
requested CRUD operation that should be performed on the [reducer](#reducer).

- `id`: The `requestId` included in the [request action](#requestaction)
- `createdAt`: The timestamp at which the [request action](#requestaction) hits
  the reducer
  - `unixMilliseconds`: Milliseconds since the Unix epoch
  - `formattedString` (optional): Formatted timestamp according to the format
    passed in the reducer's [config](#reducerconfig) prop
- `completedAt`: The timestamp at which a [success](#success-actions) or
  [fail action](#failaction) with the [request action's](#requestaction)
  `requestId` hits the reducer
  - `unixMilliseconds`: Milliseconds since the Unix epoch
  - `formattedString` (optional): Formatted timestamp according to the format
    passed in the reducer's [config](#reducerconfig) prop
- `isPending`: Boolean flag set to `true` when the
  [request action](#requestaction) hits the reducer and to `false` when
  either a [success](#success-actions) or a [fail](#failaction) action with the
  [request action's](#requestaction) `requestId` does
- `requestMetadata`: The [request metadata](#requestmetadata) object passed
  with the [request action](#requestaction)
- `isOk` (optional): Boolean flag set to `true` when a
  [success action](#success-actions) with the
  [request action's](#requestaction) `requestId` hits the reducer or to `false`
  when a [fail action](#failaction) does
- `entityPks` (optional): String array with the primary keys of the
  [data entities](#2-entity-data) that get modified when a
  [success action](#success-actions) with the
  [request action's](#requestaction) `requestId` hits the reducer
- `statusCode` (optional): The status code in a [success](#success-actions) or
  a [fail](#failaction) action, with the [request action's](#requestaction)
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
`__edges__`, as defined in the reducer's [PK schema](#pkschema).

#### `config`

The [reducer configuration](#reducerconfig) object with all
[config params](#configuration).

### Reducer actions

As stated above, [normalized reducers](#normalized-reducers) are often used to
store [entity data](#2-entity-data), usually fetched asynchronously from remote
RESTful APIs. This is why the [reducer](#reducer) contains a
[requests](#requests) prop and all interactions with
[normalized reducers](#normalized-reducers) should be initiated with a
[request action](#requestaction) and completed with a
[success](#success-actions) or [fail action](#failaction).

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
  EntityT extends Entity<ReducerEdges>
>(
  initialReducerMetadata: ReducerMetadataT,
  initialReducerData: ReducerData<EntityT>,
  config?: Partial<ReducerConfig>,
): Reducer<ReducerMetadataT, EntityT>;
```

Creates a typed initial state for a reducer.

\*\* The `EntityT` generic type required by this function is not inferred from
the function's arguments when `initialReducerData` is an empty object,
therefore it is recommended that consumers declare the function's generic
types explicitly in function calls.

### Normalizer utils

#### `normalizeEntityArrayByPk`

```typescript
function normalizeEntityArrayByPk<
  EntityT extends Entity<ReducerEdges>,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(pkSchema: PkSchemaT, entityArray: EntityT[]): ReducerData<EntityT>;
```

Converts an array of entities into an object, indexed by the entities' PKs.

### PK utils

#### `createReducerPkUtils`

```typescript
function createReducerPkUtils<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(pkSchema: PkSchemaT): ReducerPkUtils<ReducerMetadataT, EntityT, PkSchemaT>;
```

Creates an object that contains a reducer's Pk schema as well as PK utility
functions.

##### `pkSchema`

The [PK schema](#pkschema) used to create the PK concatenated strings that
index the entities in the [reducer's data](#data) prop.

##### `getPkOfEntity`

A function that takes an entity and returns the entity's PK

##### `destructPk`

A function that takes an entity's PK and returns a
[destructed entity PK](#destructedpk)

#### `emptyPkSchema`

```typescript
const emptyPkSchema: PkSchema<Entity<ReducerEdges>, [], []> = {
  fields: [],
  edges: [],
  separator: '',
  subSeparator: '',
};
```

An empty [PK schema](#pkschema-prop) to initialize reducers that don't store
entity data.

### Reducer handlers

An abstraction layer of utility functions that handle the manipulation of the
reducer's state for CRUD operations on reducer's metadata or on entity data.

Example:

```typescript
function UsersReducer(
  state: UsersReducer = usersInitialState,
  action: UsersReducerHittingAction,
): UsersReducer {
  switch (action.type) {
    case UsersActionTypes.USERS_GET_MANY__REQUEST:
      return handleRequest(state, action);
    case UsersActionTypes.USERS_GET_MANY__SUCCESS:
      return handleSaveWholeEntities(state, action);
    case UsersActionTypes.USERS_GET_MANY__FAIL:
      return handleFail(state, action);
    default:
      return state;
  }
}
```

#### `handleDeleteEntities`

```typescript
function handleDeleteEntities<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: DeleteEntitiesAction<ActionTypeT, ReducerMetadataT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleFail`

```typescript
function handleFail<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: FailAction<ActionTypeT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleRequest`

```typescript
function handleRequest<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  RequestMetadataT extends RequestMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: RequestAction<ActionTypeT, RequestMetadataT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleSavePartialEntities`

```typescript
function handleSavePartialEntities<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: SavePartialEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleSavePartialPatternToEntities`

```typescript
function handleSavePartialPatternToEntities<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: SavePartialPatternToEntitiesAction<
    ActionTypeT,
    ReducerMetadataT,
    EntityT
  >,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleSavePartialReducerMetadata`

```typescript
function handleSavePartialReducerMetadata<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: SavePartialReducerMetadataAction<ActionTypeT, ReducerMetadataT>,
): Reducer<ReducerMetadataT, EntityT>;
```

#### `handleSaveWholeEntities`

```typescript
function handleSaveWholeEntities<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: SaveWholeEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>,
): Reducer<ReducerMetadataT, EntityT>;
```

### Selectors creators

#### `createReducerSelectors`

```typescript
function createReducerSelectors<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  ReducerPathT extends string[],
  ReduxState extends ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>
>(
  reducerPath: ReducerPathT,
): ReducerSelectors<ReducerMetadataT, EntityT, ReduxState>;
```

Creates an object that containes
[reselect](https://github.com/reduxjs/reselect) selectors to select a
[reducer](#reducer)'s props.

## Types

### Action types

#### Request actions

##### `RequestAction`

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

#### Success actions

##### `DeleteEntitiesAction`

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

##### `SavePartialEntitiesAction`

```typescript
type SavePartialEntitiesAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
> = {
  type: ActionTypeT;
  partialEntities: ReducerPartialData<EntityT>;
  partialReducerMetadata?: Partial<ReducerMetadataT>;
  requestId?: string;
  subRequests?: SubRequest[];
  statusCode?: number;
};
```

##### `SavePartialPatternToEntitiesAction`

```typescript
type SavePartialPatternToEntitiesAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
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
```

##### `SavePartialReducerMetadataAction`

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

##### `SaveWholeEntitiesAction`

```typescript
type SaveWholeEntitiesAction<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
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

#### Fail actions

##### `FailAction`

```typescript
type FailAction<ActionTypeT extends string> = {
  type: ActionTypeT;
  error: string;
  requestId: string;
  statusCode?: number;
};
```

### PK types

#### `DestructedPk`

```typescript
type DestructedPk<
  EntityT extends Entity<ReducerEdges>,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
> = {
  fields: { [field in PkSchemaT['fields'][number]]: string };
  edges: { [edge in PkSchemaT['edges'][number]]: string[] };
};
```

#### `PkSchema`

```typescript
type PkSchema<
  EntityT extends Entity<ReducerEdges>,
  FieldsT extends PkSchemaFields<EntityT>,
  EdgesT extends PkSchemaEdges<EntityT>
> = {
  fields: FieldsT;
  edges: EdgesT;
  separator: string;
  subSeparator: string;
};
```

#### `PkSchemaEdges`

```typescript
type PkSchemaEdges<
  EntityT extends Entity<ReducerEdges>
> = (keyof EntityT['__edges__'])[];
```

#### `PkSchemaFields`

```typescript
type PkSchemaFields<EntityT extends Entity<ReducerEdges>> = Exclude<
  keyof EntityT,
  '__edges__'
>[];
```

#### `ReducerPkUtils`

```typescript
type ReducerPkUtils<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
> = {
  pkSchema: PkSchemaT;
  getPkOfEntity: (entity: EntityT) => string;
  destructPk: (pk: string) => DestructedPk<EntityT, PkSchemaT>;
};
```

### Reducer types

#### `Entity`

```typescript
type Entity<ReducerEdgesT extends ReducerEdges> = {
  [fieldKey: string]: unknown;
  __edges__?: {
    [edgeName in keyof ReducerEdgesT]: string[] | null;
  };
};
```

#### `Reducer`

```typescript
type Reducer<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>
> = {
  requests: { [requestId: string]: Request };
  metadata: ReducerMetadataT;
  data: ReducerData<EntityT>;
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
type ReducerData<EntityT extends Entity<ReducerEdges>> = {
  [entityPk: string]: EntityT;
};
```

#### `ReducerEdge`

```typescript
type ReducerEdge = {
  entityReducerPath: string[];
  relationReducerPath?: string[];
  relationSide?: RelationSide;
};
```

#### `ReducerEdges`

```typescript
type ReducerEdges = {
  [edgeName: string]: ReducerEdge;
};
```

#### `ReducerGroup`

```typescript
type ReducerGroup<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  ReducerPathT extends string[]
> = {
  [reducerOrGroup in ReducerPathT[number]]?:
    | Reducer<ReducerMetadataT, EntityT>
    | ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>;
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
type ReducerPartialData<EntityT extends Entity<ReducerEdges>> = {
  [entityPk: string]: Partial<
    Omit<EntityT, '__edges__'> & {
      __edges__?: Partial<EntityT['__edges__']>;
    }
  >;
};
```

#### `RelationSide`

```typescript
enum RelationSide {
  slave,
  master,
}
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

### Selector types

#### `ReducerSelectors`

```typescript
type ReducerSelectors<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  ReducerPathT extends string[],
  ReduxState extends ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>
> = {
  selectRequests: OutputSelector<
    ReduxState,
    Reducer<ReducerMetadataT, EntityT>['requests'],
    (
      res: Reducer<ReducerMetadataT, EntityT>,
    ) => Reducer<ReducerMetadataT, EntityT>['requests']
  >;
  selectMetadata: OutputSelector<
    ReduxState,
    Reducer<ReducerMetadataT, EntityT>['metadata'],
    (
      res: Reducer<ReducerMetadataT, EntityT>,
    ) => Reducer<ReducerMetadataT, EntityT>['metadata']
  >;
  selectData: OutputSelector<
    ReduxState,
    Reducer<ReducerMetadataT, EntityT>['data'],
    (
      res: Reducer<ReducerMetadataT, EntityT>,
    ) => Reducer<ReducerMetadataT, EntityT>['data']
  >;
  selectConfig: OutputSelector<
    ReduxState,
    Reducer<ReducerMetadataT, EntityT>['config'],
    (
      res: Reducer<ReducerMetadataT, EntityT>,
    ) => Reducer<ReducerMetadataT, EntityT>['config']
  >;
};
```

## Donate

I developed this framework entirely in my free time and without monetary
retribution. You are welcome and encouraged to use it free of charge but if it
serves your purpose and you want to contribute to the project, any amount of
donation is greatly appreciated!

|                                                                    Paypal                                                                    |                                                                     BTC                                                                      |
| :------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: |
|       <a href="https://paypal.me/pools/c/8t2WvAATaG"><img src="https://www.paypalobjects.com/en_US/NL/i/btn/btn_donateCC_LG.gif"></a>        | <img src="https://raw.githubusercontent.com/lolero/normalized-reducers-utils/master/readme-assets/btc-address.png" height="128" width="128"> |
|                                                     https://paypal.me/pools/c/8t2WvAATaG                                                     |                                                  bc1q7gq4crnt2t47nk9fnzc8vh488ekmns7l8ufj7z                                                  |
|                                                                     DGB                                                                      |                                                                     ETH                                                                      |
| <img src="https://raw.githubusercontent.com/lolero/normalized-reducers-utils/master/readme-assets/dgb-address.png" height="128" width="128"> | <img src="https://raw.githubusercontent.com/lolero/normalized-reducers-utils/master/readme-assets/eth-address.png" height="128" width="128"> |
|                                                 dgb1qpp2xxe3e32zqwyvm4rzmqy07t4k642eulkz0a7                                                  |                                                  0x220E622eBF471F9b12203DC8E2107b5be1171AA8                                                  |

## Acknowledgments

<a href="https://www.jetbrains.com/?from=normalized-reducers-utils"><img src="https://raw.githubusercontent.com/lolero/normalized-reducers-utils/master/readme-assets/jetbrains-logo.png" height="128" width="128"></a>
This project is developed with JetBrains IDEs and their Open Source license is
greatly appreciated!

<a href="https://github.com/AngSin"><img src="https://avatars3.githubusercontent.com/u/30783941?s=400&u=9ce3c54ef91e5413e35be0766083f46598ee91ee&v=4" height="128" width="128"></a>
Thanks to [AngSin](https://github.com/AngSin) for his valuable contributions.
