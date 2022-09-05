import { createInitialState, defaultReducerConfig } from './initialState.utils';
import {
  testEntity1,
  testInitialReducerMetadata,
  TestEntity,
  TestReducer,
  testReducerConfig,
  getPkOfTestEntity,
} from './spec.utils';

describe('initialState.utils', () => {
  describe('createInitialState', () => {
    it('Should create initial state for initially empty entity data reducer', () => {
      const testInitialState = createInitialState<
        TestReducer['metadata'],
        TestEntity
      >(
        testInitialReducerMetadata,
        {},
        {
          failRequestsCache: 10,
          requestsPrettyTimestamps: {
            format: 'utc',
            timezone: 'utc',
          },
        },
      );

      expect(testInitialState).toEqual({
        requests: {},
        metadata: testInitialReducerMetadata,
        data: {},
        config: testReducerConfig,
      });
    });

    it('Should populate initial state reducer data', () => {
      const entityPk = getPkOfTestEntity(testEntity1);

      const testInitialReducerData = {
        [entityPk]: testEntity1,
      };

      const testInitialState = createInitialState<
        TestReducer['metadata'],
        TestEntity
      >(testInitialReducerMetadata, testInitialReducerData);

      expect(testInitialState.data).toBe(testInitialReducerData);
    });

    it('Should create initial state for only metadata reducer', () => {
      const testInitialState = createInitialState<
        TestReducer['metadata'],
        never
      >(testInitialReducerMetadata, {});

      expect(testInitialState).toEqual({
        requests: {},
        metadata: testInitialReducerMetadata,
        data: {},
        config: defaultReducerConfig,
      });
    });
  });
});
