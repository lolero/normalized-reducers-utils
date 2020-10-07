import { createInitialState } from '../initialState.utils';
import {
  TestEntity,
  testInitialReducerMetadata,
  TestReducer,
} from '../tests.utils';
import { selectReducerProp } from '../selectors';

describe('selectors', () => {
  describe('selectReducerProp', () => {
    it('Should select reducer prop', () => {
      const testInitialState = createInitialState<
        TestReducer['metadata'],
        TestEntity
      >(testInitialReducerMetadata, {});

      const metadata = selectReducerProp(testInitialState, 'metadata');

      expect(metadata).toBe(metadata);
    });
  });
});
