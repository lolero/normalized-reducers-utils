import {
  createInitialState,
  defaultReducerConfig,
  emptyGenericPkSchema,
} from '../initialState.utils';
import {
  testEntity1,
  testInitialReducerMetadata,
  TestEntity,
  testPkSchema,
  TestReducer,
  testReducerConfig,
} from '../tests.utils';
import { destructurePk, getPkOfEntity } from '../pk.utils';

describe('initialTestUtils', () => {
  describe('createInitialState', () => {
    it('Should create initial state for initially empty entity data reducer', () => {
      const testInitialState = createInitialState<
        TestReducer['metadata'],
        TestEntity
      >(testInitialReducerMetadata, {}, testPkSchema, testReducerConfig);

      expect(testInitialState).toEqual(
        expect.objectContaining({
          requests: {},
          metadata: testInitialReducerMetadata,
          data: {},
          pkSchema: testPkSchema,
          config: testReducerConfig,
        }),
      );

      expect(testInitialState.getPk(testEntity1)).toBe(
        getPkOfEntity(testEntity1, testPkSchema),
      );

      expect(
        testInitialState.destructurePk(
          getPkOfEntity(testEntity1, testPkSchema),
        ),
      ).toEqual(
        destructurePk(getPkOfEntity(testEntity1, testPkSchema), testPkSchema),
      );
    });

    it('Should populate initial state reducer data', () => {
      const testInitialReducerData = {
        [getPkOfEntity(testEntity1, testPkSchema)]: testEntity1,
      };

      const testInitialState = createInitialState<
        TestReducer['metadata'],
        TestEntity
      >(testInitialReducerMetadata, testInitialReducerData, testPkSchema);

      expect(testInitialState.data).toEqual(testInitialReducerData);
    });

    it('Should create initial state for only metadata reducer', () => {
      const testInitialState = createInitialState<
        TestReducer['metadata'],
        never
      >(testInitialReducerMetadata, {}, emptyGenericPkSchema);

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
