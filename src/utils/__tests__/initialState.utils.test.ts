import {
  createInitialState,
  defaultReducerConfig,
  emptyPkSchema,
} from '../initialState.utils';
import {
  testEntity1,
  testInitialReducerMetadata,
  TestEntity,
  testPkSchema,
  TestReducer,
  testReducerConfig,
} from '../tests.utils';
import { destructPk, getPkOfEntity } from '../pk.utils';

describe('initialTestUtils', () => {
  describe('createInitialState', () => {
    it('Should create initial state for initially empty entity data reducer', () => {
      const testInitialState = createInitialState<
        TestReducer['metadata'],
        TestEntity,
        typeof testPkSchema
      >(testInitialReducerMetadata, {}, testPkSchema, testReducerConfig);

      const entityPk = getPkOfEntity<TestEntity, typeof testPkSchema>(
        testEntity1,
        testPkSchema,
      );

      const destructedPk = destructPk<TestEntity, typeof testPkSchema>(
        getPkOfEntity<TestEntity, typeof testPkSchema>(
          testEntity1,
          testPkSchema,
        ),
        testPkSchema,
      );

      expect(testInitialState).toEqual(
        expect.objectContaining({
          requests: {},
          metadata: testInitialReducerMetadata,
          data: {},
          pkSchema: testPkSchema,
          config: testReducerConfig,
        }),
      );

      expect(testInitialState.getPk(testEntity1)).toBe(entityPk);

      expect(testInitialState.destructPk(entityPk)).toEqual(destructedPk);
    });

    it('Should populate initial state reducer data', () => {
      const entityPk = getPkOfEntity<TestEntity, typeof testPkSchema>(
        testEntity1,
        testPkSchema,
      );

      const testInitialReducerData = {
        [entityPk]: testEntity1,
      };

      const testInitialState = createInitialState<
        TestReducer['metadata'],
        TestEntity,
        typeof testPkSchema
      >(testInitialReducerMetadata, testInitialReducerData, testPkSchema);

      expect(testInitialState.data).toBe(testInitialReducerData);
    });

    it('Should create initial state for only metadata reducer', () => {
      const testInitialState = createInitialState<
        TestReducer['metadata'],
        never,
        typeof emptyPkSchema
      >(testInitialReducerMetadata, {}, emptyPkSchema);

      expect(testInitialState).toEqual(
        expect.objectContaining({
          requests: {},
          metadata: testInitialReducerMetadata,
          data: {},
          pkSchema: { fields: [], edges: [], separator: '' },
          config: defaultReducerConfig,
        }),
      );
    });
  });
});
