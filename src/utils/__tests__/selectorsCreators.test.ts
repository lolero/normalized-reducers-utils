import { createInitialState } from '../initialState.utils';
import {
  TestEntity,
  testInitialReducerMetadata,
  TestReducer,
  TestState,
} from '../tests.utils';
import * as selectors from '../selectors';
import {
  createReducerPropSelector,
  createReducerSelectors,
} from '../selectorsCreators';

describe('selectorsCreators', () => {
  let selectReducerPropSpy: jest.SpyInstance;
  let state: TestState;

  beforeEach(() => {
    state = {
      testReducerGroup1: {
        testReducer1: createInitialState<TestReducer['metadata'], TestEntity>(
          testInitialReducerMetadata,
          {},
        ),
        testReducer2: createInitialState<TestReducer['metadata'], TestEntity>(
          testInitialReducerMetadata,
          {},
        ),
      },
      testReducerGroup2: {
        testReducer3: createInitialState<TestReducer['metadata'], TestEntity>(
          testInitialReducerMetadata,
          {},
        ),
        testReducer4: createInitialState<TestReducer['metadata'], TestEntity>(
          testInitialReducerMetadata,
          {},
        ),
      },
    };

    selectReducerPropSpy = jest.spyOn(selectors, 'selectReducerProp');
  });

  afterEach(() => {
    selectReducerPropSpy.mockRestore();
  });

  describe('createReducerPropSelector', () => {
    it('Should create reducer prop selector', () => {
      const selectTestReducer1Metadata = createReducerPropSelector<
        TestReducer['metadata'],
        TestEntity,
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
    it('Should create reducer selectors', () => {
      const reducerPropSelectors = createReducerSelectors<
        TestReducer['metadata'],
        TestEntity,
        TestState
      >(['testReducerGroup1', 'testReducer1']);

      expect(reducerPropSelectors).toEqual({
        selectRequests: expect.any(Function),
        selectMetadata: expect.any(Function),
        selectData: expect.any(Function),
        selectConfig: expect.any(Function),
      });

      expect(reducerPropSelectors.selectRequests(state)).toEqual(
        state.testReducerGroup1.testReducer1.requests,
      );
      expect(reducerPropSelectors.selectMetadata(state)).toEqual(
        state.testReducerGroup1.testReducer1.metadata,
      );
      expect(reducerPropSelectors.selectData(state)).toEqual(
        state.testReducerGroup1.testReducer1.data,
      );
      expect(reducerPropSelectors.selectConfig(state)).toEqual(
        state.testReducerGroup1.testReducer1.config,
      );
    });
  });
});
