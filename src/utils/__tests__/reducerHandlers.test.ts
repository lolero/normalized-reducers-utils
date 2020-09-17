import {
  testInitialReducerMetadata,
  TestEntity,
  testEntity1,
  testEntity2,
  testEntity3,
  testPkSchema,
  TestReducer,
  TestRequestMetadata,
} from '../tests.utils';
import { getPkOfEntity } from '../pk.utils';
import {
  DeleteEntitiesAction,
  FailAction,
  RequestAction,
  SaveWholeEntitiesAction,
  SavePartialEntitiesAction,
  SavePartialReducerMetadataAction,
  SavePartialPatternToEntitiesAction,
} from '../../types/actions.types';
import {
  createInitialState,
  defaultReducerConfig,
} from '../initialState.utils';
import * as ReducerHandlersUtils from '../reducerHandlers.utils';
import {
  handleDeleteEntities,
  handleFail,
  handleRequest,
  handleSaveWholeEntities,
  handleSavePartialEntities,
  handleSavePartialReducerMetadata,
  handleSavePartialPatternToEntities,
} from '../reducerHandlers';

describe('reducerHandlers', () => {
  let state: TestReducer;
  let duplicatedState: TestReducer;
  let duplicateStateSpy: jest.SpyInstance;
  let handleCommonPropsSpy: jest.SpyInstance;
  let updateCompletedRequestsCacheSpy: jest.SpyInstance;

  beforeEach(() => {
    state = createInitialState<
      TestReducer['metadata'],
      TestEntity,
      typeof testPkSchema
    >(testInitialReducerMetadata, {}, testPkSchema);
    duplicatedState = createInitialState<
      TestReducer['metadata'],
      TestEntity,
      typeof testPkSchema
    >(testInitialReducerMetadata, {}, testPkSchema);
    duplicateStateSpy = jest
      .spyOn(ReducerHandlersUtils, 'duplicateState')
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      .mockImplementation(() => duplicatedState);
    handleCommonPropsSpy = jest
      .spyOn(ReducerHandlersUtils, 'handleCommonProps')
      .mockImplementation((stateTemp) => stateTemp);
    updateCompletedRequestsCacheSpy = jest
      .spyOn(ReducerHandlersUtils, 'updateCompletedRequestsCache')
      .mockImplementation((stateTemp) => stateTemp);
  });

  afterEach(() => {
    duplicateStateSpy.mockRestore();
    handleCommonPropsSpy.mockRestore();
    updateCompletedRequestsCacheSpy.mockRestore();
  });

  describe('handleRequest', () => {
    let testRequestAction: RequestAction<
      'testRequestAction',
      TestRequestMetadata
    >;

    beforeEach(() => {
      testRequestAction = {
        type: 'testRequestAction',
        requestMetadata: {
          testRequestMetadata: 'testRequestMetadata',
        },
        requestId: 'testRequestActionRequestId',
      };
    });

    it('Should handle request', () => {
      const newState = handleRequest<
        'testRequestAction',
        TestReducer['metadata'],
        TestEntity,
        TestRequestMetadata
      >(state, testRequestAction);

      expect(duplicateStateSpy).toHaveBeenCalledWith(state, testRequestAction);
      expect(newState).toEqual({
        ...duplicatedState,
        requests: {
          [testRequestAction.requestId]: {
            id: testRequestAction.requestId,
            createdAt: {
              unixMilliseconds: expect.any(Number),
            },
            isPending: true,
            metadata: testRequestAction.requestMetadata,
          },
        },
      });
    });

    describe('state.config.requestsPrettyTimestamps', () => {
      it("Should format string of request's timestamps to ISO string with UTC timezone", () => {
        state.config = {
          ...defaultReducerConfig,
          requestsPrettyTimestamps: {
            format: 'utc',
            timezone: 'utc',
          },
        };

        const newState = handleRequest<
          'testRequestAction',
          TestReducer['metadata'],
          TestEntity,
          TestRequestMetadata
        >(state, testRequestAction);

        const requestCreatedAt = newState.requests[
          testRequestAction.requestId as string
        ].createdAt as {
          unixMilliseconds: number;
          formattedString?: string;
        };
        const createdDate = new Date(requestCreatedAt.unixMilliseconds);
        expect(requestCreatedAt.formattedString).toBe(
          createdDate.toISOString(),
        );
      });
    });
  });

  describe('handleSavePartialReducerMetadata', () => {
    it('Should handle save partial reducer metadata', () => {
      const testSavePartialReducerMetadataAction: SavePartialReducerMetadataAction<
        'testSavePartialReducerMetadataAction',
        TestReducer['metadata']
      > = {
        type: 'testSavePartialReducerMetadataAction',
        partialReducerMetadata: {},
      };

      handleSavePartialReducerMetadata<
        'testSavePartialReducerMetadataAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialReducerMetadataAction);

      expect(duplicateStateSpy).toHaveBeenCalledWith(
        state,
        testSavePartialReducerMetadataAction,
      );
      expect(handleCommonPropsSpy).toHaveBeenCalledWith(
        duplicatedState,
        testSavePartialReducerMetadataAction,
      );
      expect(updateCompletedRequestsCacheSpy).toHaveBeenCalledWith(
        duplicatedState,
      );
    });
  });

  describe('handleSaveWholeEntities', () => {
    it('Should handle save whole entities without flushing reducer', () => {
      duplicatedState.data = {
        [getPkOfEntity(testEntity1, testPkSchema)]: testEntity1,
      };
      const testSaveWholeEntitiesAction: SaveWholeEntitiesAction<
        'testSaveWholeEntitiesAction',
        never,
        TestEntity
      > = {
        type: 'testSaveWholeEntitiesAction',
        wholeEntities: {
          [state.getPk(testEntity2)]: testEntity2,
          [state.getPk(testEntity3)]: testEntity3,
        },
      };

      const newState = handleSaveWholeEntities<
        'testSaveWholeEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSaveWholeEntitiesAction);

      expect(duplicateStateSpy).toHaveBeenCalledWith(
        state,
        testSaveWholeEntitiesAction,
      );
      expect(handleCommonPropsSpy).toHaveBeenCalledWith(
        duplicatedState,
        testSaveWholeEntitiesAction,
      );
      expect(updateCompletedRequestsCacheSpy).toHaveBeenCalledWith(
        duplicatedState,
      );
      expect(newState).toEqual({
        ...duplicatedState,
        data: {
          ...duplicatedState.data,
          ...testSaveWholeEntitiesAction.wholeEntities,
        },
      });
    });

    it('Should handle save whole entities with flushing reducer', () => {
      duplicatedState.data = {
        [state.getPk(testEntity1)]: testEntity1,
      };
      const testSaveWholeEntitiesAction: SaveWholeEntitiesAction<
        'testSaveWholeEntitiesAction',
        never,
        TestEntity
      > = {
        type: 'testSaveWholeEntitiesAction',
        wholeEntities: {
          [state.getPk(testEntity2)]: testEntity2,
          [state.getPk(testEntity3)]: testEntity3,
        },
        flush: true,
      };

      const newState = handleSaveWholeEntities<
        'testSaveWholeEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSaveWholeEntitiesAction);

      expect(duplicateStateSpy).toHaveBeenCalledWith(
        state,
        testSaveWholeEntitiesAction,
      );
      expect(handleCommonPropsSpy).toHaveBeenCalledWith(
        duplicatedState,
        testSaveWholeEntitiesAction,
      );
      expect(updateCompletedRequestsCacheSpy).toHaveBeenCalledWith(
        duplicatedState,
      );
      expect(newState).toEqual({
        ...duplicatedState,
        data: {
          ...testSaveWholeEntitiesAction.wholeEntities,
        },
      });
    });
  });

  describe('handleSavePartialEntities', () => {
    it('Should handle save partial entities', () => {
      duplicatedState.data = {
        [state.getPk(testEntity1)]: testEntity1,
        [state.getPk(testEntity2)]: testEntity2,
      };
      const testSavePartialEntitiesAction: SavePartialEntitiesAction<
        'testSavePartialEntitiesAction',
        never,
        TestEntity
      > = {
        type: 'testSavePartialEntitiesAction',
        partialEntities: {
          [state.getPk(testEntity1)]: {
            name: 'newTestName1',
            isTrue: false,
            __edges__: {
              parent: {
                entity: 'testEntity',
                pks: ['newTestParent'],
              },
              children: {
                entity: 'testEntity',
                pks: ['testEntityId2', 'testEntityId3', 'newTestChild'],
              },
            },
          },
          [state.getPk(testEntity2)]: {
            name: 'newTestName2',
            __edges__: {
              children: {
                entity: 'testEntity',
                pks: ['newTestChild'],
              },
            },
          },
        },
      };

      const newState = handleSavePartialEntities<
        'testSavePartialEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialEntitiesAction);

      expect(duplicateStateSpy).toHaveBeenCalledWith(
        state,
        testSavePartialEntitiesAction,
      );
      expect(handleCommonPropsSpy).toHaveBeenCalledWith(
        duplicatedState,
        testSavePartialEntitiesAction,
      );
      expect(updateCompletedRequestsCacheSpy).toHaveBeenCalledWith(
        duplicatedState,
      );
      expect(newState).toEqual({
        ...duplicatedState,
        data: {
          ...duplicatedState.data,
          [state.getPk(testEntity1)]: {
            ...testEntity1,
            ...testSavePartialEntitiesAction.partialEntities[
              state.getPk(testEntity1)
            ],
            __edges__: {
              ...testEntity1.__edges__,
              ...testSavePartialEntitiesAction.partialEntities[
                state.getPk(testEntity1)
              ].__edges__,
            },
          },
          [state.getPk(testEntity2)]: {
            ...testEntity2,
            ...testSavePartialEntitiesAction.partialEntities[
              state.getPk(testEntity2)
            ],
            __edges__: {
              ...testEntity2.__edges__,
              ...testSavePartialEntitiesAction.partialEntities[
                state.getPk(testEntity2)
              ].__edges__,
            },
          },
        },
      });
    });
  });

  describe('handleSavePartialPatternToEntities', () => {
    it('Should handle save partial pattern to entities', () => {
      duplicatedState.data = {
        [state.getPk(testEntity1)]: testEntity1,
        [state.getPk(testEntity2)]: testEntity2,
        [state.getPk(testEntity3)]: testEntity3,
      };
      const testSavePartialPatternToEntitiesAction: SavePartialPatternToEntitiesAction<
        'testSavePartialPatternToEntitiesAction',
        never,
        TestEntity
      > = {
        type: 'testSavePartialPatternToEntitiesAction',
        entityPks: [
          state.getPk(testEntity1),
          state.getPk(testEntity2),
          state.getPk(testEntity3),
        ],
        partialEntity: {
          isTrue: true,
          number: 10,
          __edges__: {
            sibling: {
              entity: 'testEntity',
              pks: ['testSibling'],
            },
          },
        },
      };

      const newState = handleSavePartialPatternToEntities<
        'testSavePartialPatternToEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialPatternToEntitiesAction);

      expect(duplicateStateSpy).toHaveBeenCalledWith(
        state,
        testSavePartialPatternToEntitiesAction,
      );
      expect(handleCommonPropsSpy).toHaveBeenCalledWith(
        duplicatedState,
        testSavePartialPatternToEntitiesAction,
      );
      expect(updateCompletedRequestsCacheSpy).toHaveBeenCalledWith(
        duplicatedState,
      );
      expect(newState).toEqual({
        ...duplicatedState,
        data: {
          ...duplicatedState.data,
          [getPkOfEntity(testEntity1, testPkSchema)]: {
            ...testEntity1,
            ...testSavePartialPatternToEntitiesAction.partialEntity,
            __edges__: {
              ...testEntity1.__edges__,
              ...testSavePartialPatternToEntitiesAction.partialEntity.__edges__,
            },
          },
          [getPkOfEntity(testEntity2, testPkSchema)]: {
            ...testEntity2,
            ...testSavePartialPatternToEntitiesAction.partialEntity,
            __edges__: {
              ...testEntity2.__edges__,
              ...testSavePartialPatternToEntitiesAction.partialEntity.__edges__,
            },
          },
          [getPkOfEntity(testEntity3, testPkSchema)]: {
            ...testEntity3,
            ...testSavePartialPatternToEntitiesAction.partialEntity,
            __edges__: {
              ...testEntity3.__edges__,
              ...testSavePartialPatternToEntitiesAction.partialEntity.__edges__,
            },
          },
        },
      });
    });
  });

  describe('handleDeleteEntities', () => {
    it('Should handle delete entities', () => {
      duplicatedState.data = {
        [state.getPk(testEntity1)]: testEntity1,
        [state.getPk(testEntity2)]: testEntity2,
        [state.getPk(testEntity3)]: testEntity3,
      };
      const testDeleteEntitiesAction: DeleteEntitiesAction<
        'testDeleteEntitiesAction',
        never
      > = {
        type: 'testDeleteEntitiesAction',
        entityPks: [state.getPk(testEntity1), state.getPk(testEntity3)],
      };

      const newState = handleDeleteEntities<
        'testDeleteEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testDeleteEntitiesAction);

      expect(duplicateStateSpy).toHaveBeenCalledWith(
        state,
        testDeleteEntitiesAction,
      );
      expect(handleCommonPropsSpy).toHaveBeenCalledWith(
        duplicatedState,
        testDeleteEntitiesAction,
      );
      expect(updateCompletedRequestsCacheSpy).toHaveBeenCalledWith(
        duplicatedState,
      );
      expect(newState).toEqual({
        ...duplicatedState,
        data: {
          [state.getPk(testEntity2)]: testEntity2,
        },
      });
    });
  });

  describe('handleFail', () => {
    it('Should handle fail', () => {
      const testFailAction: FailAction<'testFailAction'> = {
        type: 'testFailAction',
        error: 'testRequestActionRequestId',
        requestId: 'testRequestId',
      };

      handleFail<'testFailAction', TestReducer['metadata'], TestEntity>(
        state,
        testFailAction,
      );

      expect(duplicateStateSpy).toHaveBeenCalledWith(state, testFailAction);
      expect(handleCommonPropsSpy).toHaveBeenCalledWith(
        duplicatedState,
        testFailAction,
      );
      expect(updateCompletedRequestsCacheSpy).toHaveBeenCalledWith(
        duplicatedState,
      );
    });
  });
});
