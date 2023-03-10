import { useSelector } from 'react-redux';
import { renderHook } from '@testing-library/react';
import { createInitialState } from './initialState.utils';
import {
  getPkOfTestEntity,
  TestEntity,
  testEntity1,
  testEntity2,
  TestEntity2,
  testEntity3,
  TestEntity3,
  TestEntity4,
  testInitialReducerMetadata,
  TestReducer,
  TestReducer2,
  TestReducer3,
  TestReducer4,
  TestReducerMetadata,
  TestState,
} from './spec.utils';
import { createReducerSelectors } from './selectorsCreators';
import { ReducerHooks } from '../types/hooks.types';
import { createReducerHooks } from './hooksCreators';
import { ReducerSelectors } from '../types/selectors.types';

jest.mock('react-redux');

describe('hooksCreators', () => {
  let state: TestState;

  beforeEach(() => {
    state = {
      testReducerGroup1: {
        testReducer1: createInitialState<TestReducer['metadata'], TestEntity>(
          testInitialReducerMetadata,
          {
            [getPkOfTestEntity(testEntity1)]: testEntity1,
            [getPkOfTestEntity(testEntity2)]: testEntity2,
            [getPkOfTestEntity(testEntity3)]: testEntity3,
          },
        ),
        testReducer2: createInitialState<TestReducer2['metadata'], TestEntity2>(
          {},
          {},
        ),
      },
      testReducerGroup2: {
        testReducer3: createInitialState<TestReducer3['metadata'], TestEntity3>(
          {},
          {},
        ),
        testReducer4: createInitialState<TestReducer4['metadata'], TestEntity4>(
          {},
          {},
        ),
      },
    };

    state.testReducerGroup1.testReducer1.requests = {
      requestId1: {
        id: 'requestId1',
        createdAt: {
          unixMilliseconds: 0,
        },
        isPending: false,
        metadata: { metadataProp1: 0 },
      },
      requestId2: {
        id: 'requestId2',
        createdAt: {
          unixMilliseconds: 0,
        },
        isPending: false,
        metadata: { metadataProp1: 0 },
      },
      requestId3: {
        id: 'requestId3',
        createdAt: {
          unixMilliseconds: 0,
        },
        isPending: false,
        metadata: { metadataProp1: 0 },
      },
    };
  });

  describe('createReducerHooks', () => {
    let reducerPropSelectors: ReducerSelectors<
      TestReducer['metadata'],
      TestEntity,
      ['testReducerGroup1', 'testReducer1'],
      TestState
    >;
    let reducerHooks: ReducerHooks<TestReducerMetadata, TestEntity>;
    const useSelectorMock = jest.mocked(useSelector);

    beforeEach(() => {
      reducerPropSelectors = createReducerSelectors<
        TestReducer['metadata'],
        TestEntity,
        ['testReducerGroup1', 'testReducer1'],
        TestState
      >(['testReducerGroup1', 'testReducer1']);

      reducerHooks = createReducerHooks(reducerPropSelectors);
    });

    it('Should create reducer hooks', () => {
      expect(reducerHooks).toEqual({
        useRequest: expect.any(Function),
        useRequests: expect.any(Function),
        useReducerMetadata: expect.any(Function),
        useEntity: expect.any(Function),
        useEntities: expect.any(Function),
        useReducerConfig: expect.any(Function),
      });
    });

    it("Should retrieve a single request from the reducer's requests prop", () => {
      useSelectorMock.mockImplementation(() =>
        reducerPropSelectors.selectRequests(state),
      );

      const {
        result: { current },
      } = renderHook(() => reducerHooks.useRequest('requestId1'));

      expect(current).toBe(
        state.testReducerGroup1.testReducer1.requests.requestId1,
      );
    });

    it("Should retrieve multiple requests from the reducer's requests prop", () => {
      useSelectorMock.mockImplementation(() =>
        reducerPropSelectors.selectRequests(state),
      );

      const {
        result: { current },
      } = renderHook(() =>
        reducerHooks.useRequests(['requestId1', 'requestId2']),
      );

      expect(current).toEqual({
        requestId1: state.testReducerGroup1.testReducer1.requests.requestId1,
        requestId2: state.testReducerGroup1.testReducer1.requests.requestId2,
      });
    });

    it("Should retrieve the reducer's requests prop", () => {
      useSelectorMock.mockImplementation(() =>
        reducerPropSelectors.selectRequests(state),
      );

      const {
        result: { current },
      } = renderHook(() => reducerHooks.useRequests());

      expect(current).toBe(state.testReducerGroup1.testReducer1.requests);
    });

    it("Should retrieve the reducer's metadata prop", () => {
      useSelectorMock.mockImplementation(() =>
        reducerPropSelectors.selectMetadata(state),
      );

      const {
        result: { current },
      } = renderHook(() => reducerHooks.useReducerMetadata());

      expect(current).toBe(state.testReducerGroup1.testReducer1.metadata);
    });

    it("Should retrieve a single entity from the reducer's data prop", () => {
      useSelectorMock.mockImplementation(() =>
        reducerPropSelectors.selectData(state),
      );

      const {
        result: { current },
      } = renderHook(() => reducerHooks.useEntity(testEntity1.id));

      expect(current).toBe(
        state.testReducerGroup1.testReducer1.data[testEntity1.id],
      );
    });

    it("Should retrieve multiple entities from the reducer's data prop", () => {
      useSelectorMock.mockImplementation(() =>
        reducerPropSelectors.selectData(state),
      );

      const {
        result: { current },
      } = renderHook(() =>
        reducerHooks.useEntities([testEntity1.id, testEntity2.id]),
      );

      expect(current).toEqual({
        [testEntity1.id]:
          state.testReducerGroup1.testReducer1.data[testEntity1.id],
        [testEntity2.id]:
          state.testReducerGroup1.testReducer1.data[testEntity2.id],
      });
    });

    it("Should retrieve the reducer's data prop", () => {
      useSelectorMock.mockImplementation(() =>
        reducerPropSelectors.selectData(state),
      );

      const {
        result: { current },
      } = renderHook(() => reducerHooks.useEntities());

      expect(current).toBe(state.testReducerGroup1.testReducer1.data);
    });

    it("Should retrieve the reducer's config prop", () => {
      useSelectorMock.mockImplementation(() =>
        reducerPropSelectors.selectConfig(state),
      );

      const {
        result: { current },
      } = renderHook(() => reducerHooks.useReducerConfig());

      expect(current).toBe(state.testReducerGroup1.testReducer1.config);
    });
  });
});
