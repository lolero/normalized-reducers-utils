import {
  EntityEdge,
  Entity,
  PkSchema,
  Reducer,
  ReducerMetadata,
  ReducerConfig,
  RequestMetadata,
} from '../types/reducers.types';

export interface TestRequestMetadata extends RequestMetadata {
  testRequestMetadata: string;
}

export interface TestReducerMetadata extends ReducerMetadata {
  reducerStatus: string;
  entityCount: number;
}

export interface TestEntity extends Entity {
  id: string;
  name: string;
  number: number;
  isTrue: boolean;
  __edges__: {
    parent?: EntityEdge<'testEntity', [string], never>;
    sibling?: EntityEdge<'testEntity', [string], never>;
    children?: EntityEdge<'testEntity', string[], never>;
  };
}

export const testPkSchema: PkSchema<TestEntity, ['id', 'name'], ['parent']> = {
  fields: ['id', 'name'],
  edges: ['parent'],
  separator: '___',
};

export type TestReducer = Reducer<
  TestReducerMetadata,
  TestEntity,
  typeof testPkSchema
>;

export const testEntity1: TestEntity = {
  id: 'testEntityId1',
  name: 'testEntityName1',
  number: 1,
  isTrue: true,
  __edges__: {
    children: {
      entity: 'testEntity',
      pks: ['testEntityId2', 'testEntityId3'],
    },
  },
};

export const testEntity2: TestEntity = {
  id: 'testEntityId2',
  name: 'testEntityName2',
  number: 2,
  isTrue: false,
  __edges__: {
    parent: {
      entity: 'testEntity',
      pks: ['testEntityId1'],
    },
    sibling: {
      entity: 'testEntity',
      pks: ['testEntityId3'],
    },
  },
};

export const testEntity3: TestEntity = {
  id: 'testEntityId3',
  name: 'testEntityName3',
  number: 3,
  isTrue: false,
  __edges__: {
    parent: {
      entity: 'testEntity',
      pks: ['testEntityId1'],
    },
    sibling: {
      entity: 'testEntity',
      pks: ['testEntityI2'],
    },
  },
};

export const testInitialReducerMetadata: TestReducerMetadata = {
  reducerStatus: 'ready',
  entityCount: 0,
};

export const testReducerConfig: ReducerConfig = {
  successRequestsCache: 10,
  failRequestsCache: 10,
  requestsPrettyTimestamps: {
    format: 'utc',
    timezone: 'utc',
  },
};
