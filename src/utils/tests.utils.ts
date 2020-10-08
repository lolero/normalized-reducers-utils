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
export type TestReducer = Reducer<TestReducerMetadata, TestEntity>;

export enum ReducerGroups {
  testReducerGroup1 = 'testReducerGroup1',
  testReducerGroup2 = 'testReducerGroup2',
}

export enum Reducers {
  // testReducerGroup1
  testReducer1 = 'testReducer1',
  testReducer2 = 'testReducer2',

  // testReducerGroup2
  testReducer3 = 'testReducer3',
  testReducer4 = 'testReducer4',
}

export type TestState = {
  [ReducerGroups.testReducerGroup1]: {
    [Reducers.testReducer1]: TestReducer;
    [Reducers.testReducer2]: TestReducer;
  };
  [ReducerGroups.testReducerGroup2]: {
    [Reducers.testReducer3]: TestReducer;
    [Reducers.testReducer4]: TestReducer;
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
    entityReducerPath: [ReducerGroups.testReducerGroup1, Reducers.testReducer1],
  },
  children: {
    entityReducerPath: [ReducerGroups.testReducerGroup1, Reducers.testReducer1],
  },
  emergencyContacts: {
    entityReducerPath: [ReducerGroups.testReducerGroup1, Reducers.testReducer1],
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
