import { createInitialState } from './initialState.utils';
import {
  TestEntity,
  TestEntity2,
  TestEntity3,
  TestEntity4,
  testInitialReducerMetadata,
  TestReducer,
  TestReducer2,
  TestReducer3,
  TestReducer4,
  TestState,
} from './spec.utils';
import * as selectors from './selectors';
import {
  createReducerPropSelector,
  createReducerSelectors,
} from './selectorsCreators';
import { ReducerSelectors } from '../types/selectors.types';

describe('selectorsCreators', () => {
  let state: TestState;

  beforeEach(() => {
    state = {
      testReducerGroup1: {
        testReducer1: createInitialState<TestReducer['metadata'], TestEntity>(
          testInitialReducerMetadata,
          {},
        ),
        testReducer2: createInitialState<TestReducer2['metadata'], TestEntity2>(
          {},
          {},
        ),
      },
      testReducerGroup2: {
        testReducer3: createInitialState<TestReducer3['metadata'], TestEntity3>(
          testInitialReducerMetadata,
          {},
        ),
        testReducer4: createInitialState<TestReducer4['metadata'], TestEntity4>(
          testInitialReducerMetadata,
          {},
        ),
      },
    };
  });

  describe('createReducerPropSelector', () => {
    let selectReducerPropSpy: jest.SpyInstance;

    beforeEach(() => {
      selectReducerPropSpy = jest.spyOn(selectors, 'selectReducerProp');
    });

    afterEach(() => {
      selectReducerPropSpy.mockRestore();
    });

    it('Should create reducer prop selector', () => {
      const selectTestReducer1Metadata = createReducerPropSelector<
        TestReducer['metadata'],
        TestEntity,
        ['testReducerGroup1', 'testReducer1'],
        TestState,
        'metadata'
      >(['testReducerGroup1', 'testReducer1'], 'metadata');

      let testReducer1Metadata = selectTestReducer1Metadata(state);
      expect(testReducer1Metadata).toBe(
        state.testReducerGroup1.testReducer1.metadata,
      );
      expect(selectReducerPropSpy).toHaveBeenCalledTimes(1);

      state = {
        ...state,
        testReducerGroup1: {
          ...state.testReducerGroup1,
          testReducer2: {
            ...state.testReducerGroup1.testReducer2,
          },
        },
      };
      testReducer1Metadata = selectTestReducer1Metadata(state);
      expect(testReducer1Metadata).toBe(
        state.testReducerGroup1.testReducer1.metadata,
      );
      expect(selectReducerPropSpy).toHaveBeenCalledTimes(1);
      state = {
        ...state,
        testReducerGroup1: {
          ...state.testReducerGroup1,
          testReducer1: {
            ...state.testReducerGroup1.testReducer1,
          },
        },
      };
      testReducer1Metadata = selectTestReducer1Metadata(state);
      expect(testReducer1Metadata).toBe(
        state.testReducerGroup1.testReducer1.metadata,
      );
      expect(selectReducerPropSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('createReducerSelectors', () => {
    let reducerPropSelectors: ReducerSelectors<
      TestReducer['metadata'],
      TestEntity,
      ['testReducerGroup1', 'testReducer1'],
      TestState
    >;

    beforeEach(() => {
      reducerPropSelectors = createReducerSelectors<
        TestReducer['metadata'],
        TestEntity,
        ['testReducerGroup1', 'testReducer1'],
        TestState
      >(['testReducerGroup1', 'testReducer1']);
    });

    it('Should create reducer selectors', () => {
      expect(reducerPropSelectors).toEqual({
        selectRequests: expect.any(Function),
        selectMetadata: expect.any(Function),
        selectData: expect.any(Function),
        selectConfig: expect.any(Function),
      });
    });

    it("Should select the reducer's requests prop", () => {
      expect(reducerPropSelectors.selectRequests(state)).toBe(
        state.testReducerGroup1.testReducer1.requests,
      );
    });

    it("Should select the reducer's metadata prop", () => {
      expect(reducerPropSelectors.selectMetadata(state)).toBe(
        state.testReducerGroup1.testReducer1.metadata,
      );
    });

    it("Should select the reducer's data prop", () => {
      expect(reducerPropSelectors.selectData(state)).toBe(
        state.testReducerGroup1.testReducer1.data,
      );
    });

    it("Should select the reducer's config prop", () => {
      expect(reducerPropSelectors.selectConfig(state)).toBe(
        state.testReducerGroup1.testReducer1.config,
      );
    });
  });
});
