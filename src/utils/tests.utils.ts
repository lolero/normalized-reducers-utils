import {
  Entity,
  PkSchema,
  Reducer,
  ReducerConfig,
  ReducerEdge,
  ReducerEdges,
  ReducerMetadata,
  RequestMetadata,
} from '../types/reducers.types';
import { createReducerPkUtils } from './pk.utils';

export interface TestRequestMetadata extends RequestMetadata {
  testRequestMetadata: string;
}

export interface TestReducerMetadata extends ReducerMetadata {
  reducerStatus: string;
  entityCount: number;
}

export interface TestReducerEdges extends ReducerEdges {
  parent: ReducerEdge;
  children: ReducerEdge;
  emergencyContacts: ReducerEdge;
}

export interface TestEntity extends Entity<TestReducerEdges> {
  id: string;
  name: string;
  number: number;
  isTrue: boolean;
  __edges__: {
    parent: [string] | null;
    children: string[] | null;
    emergencyContacts: [string, string];
  };
}

export interface TestEntity2 extends Entity<{}> {
  id2: string;
}

export interface TestEntity3 extends Entity<{}> {
  id3: string;
}

export interface TestEntity4 extends Entity<{}> {
  id4: string;
}

export type TestReducer = Reducer<TestReducerMetadata, TestEntity>;

export type TestReducer2 = Reducer<{}, TestEntity2>;

export type TestReducer3 = Reducer<{}, TestEntity3>;

export type TestReducer4 = Reducer<{}, TestEntity4>;

export type TestState = {
  testReducerGroup1: {
    testReducer1: TestReducer;
    testReducer2: TestReducer2;
  };
  testReducerGroup2: {
    testReducer3: TestReducer3;
    testReducer4: TestReducer4;
  };
};

export const testPkSchema: PkSchema<TestEntity, ['id'], []> = {
  fields: ['id'],
  edges: [],
  separator: '_',
  subSeparator: '-',
};

export const testReducerEdges: TestReducerEdges = {
  parent: {
    nodeReducerPath: ['testReducerGroup1', 'testReducer1'],
  },
  children: {
    nodeReducerPath: ['testReducerGroup1', 'testReducer1'],
  },
  emergencyContacts: {
    nodeReducerPath: ['testReducerGroup1', 'testReducer1'],
  },
};

export const testEntity1: TestEntity = {
  id: 'testEntityId1',
  name: 'testEntityName1',
  number: 1,
  isTrue: true,
  __edges__: {
    parent: null,
    children: ['testEntityId2', 'testEntityId3'],
    emergencyContacts: ['testEntityId2', 'testEntityId3'],
  },
};

export const testEntity2: TestEntity = {
  id: 'testEntityId2',
  name: 'testEntityName2',
  number: 2,
  isTrue: false,
  __edges__: {
    parent: ['testEntityId1'],
    children: null,
    emergencyContacts: ['testEntityId1', 'testEntityId3'],
  },
};

export const testEntity3: TestEntity = {
  id: 'testEntityId3',
  name: 'testEntityName3',
  number: 3,
  isTrue: false,
  __edges__: {
    parent: ['testEntityId1'],
    children: null,
    emergencyContacts: ['testEntityId1', 'testEntityId2'],
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

export const {
  pkSchema: testReducerPkSchema,
  getPkOfEntity: getPkOfTestEntity,
  destructPk: destructTestEntityPk,
} = createReducerPkUtils<
  TestReducer['metadata'],
  TestEntity,
  typeof testPkSchema
>(testPkSchema);
