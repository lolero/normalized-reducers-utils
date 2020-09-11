import {
  testInitialReducerMetadata,
  TestEntity,
  testEntity1,
  testEntity2,
  testPkSchema,
  TestReducer,
  testEntity3,
} from '../tests.utils';
import {
  createInitialState,
  defaultReducerConfig,
} from '../initialState.utils';
import {
  duplicateState,
  handleCommonProps,
  updateCompletedRequestsCache,
} from '../reducerHandlers.utils';
import {
  SavePartialReducerMetadataAction,
  SaveWholeEntitiesAction,
  SavePartialEntitiesAction,
  SavePartialPatternToEntitiesAction,
  DeleteEntitiesAction,
  FailAction,
  RequestAction,
} from '../../types/actions.types';
import { getPkOfEntity } from '../pk.utils';

describe('reducerHandlers', () => {
  let state: TestReducer;
  let createdDate: Date;

  beforeEach(() => {
    state = createInitialState<TestReducer['metadata'], TestEntity>(
      testInitialReducerMetadata,
      {},
      testPkSchema,
    );
    createdDate = new Date();
  });

  describe('duplicateState', () => {
    beforeEach(() => {
      state.data = {
        [getPkOfEntity(testEntity1, testPkSchema)]: testEntity1,
        [getPkOfEntity(testEntity2, testPkSchema)]: testEntity2,
        [getPkOfEntity(testEntity3, testPkSchema)]: testEntity3,
      };
    });

    it('Should duplicate state', () => {
      const testRequestAction: RequestAction<
        'testRequestAction',
        never,
        never
      > = {
        type: 'testRequestAction',
        requestId: 'testRequestActionRequestId',
      };

      const newState = duplicateState<
        'testRequestAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testRequestAction);

      expect(newState).toEqual(state);
      expect(newState).not.toBe(state);
      expect(newState.requests).not.toBe(state.requests);
      expect(newState.metadata).toBe(state.metadata);
      expect(newState.data).not.toBe(state.data);
    });

    it('Should not duplicate entities for request action', () => {
      const testRequestAction: RequestAction<
        'testRequestAction',
        never,
        never
      > = {
        type: 'testRequestAction',
        requestId: 'testRequestActionRequestId',
      };

      const newState = duplicateState<
        'testRequestAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testRequestAction);

      expect(newState.data[state.getPk(testEntity1)]).toBe(
        state.data[state.getPk(testEntity1)],
      );
      expect(newState.data[state.getPk(testEntity2)]).toBe(
        state.data[state.getPk(testEntity2)],
      );
      expect(newState.data[state.getPk(testEntity3)]).toBe(
        state.data[state.getPk(testEntity3)],
      );
    });

    it('Should not duplicate entities for save partial reducer metadata action', () => {
      const testSavePartialReducerMetadataAction: SavePartialReducerMetadataAction<
        'testSavePartialReducerMetadataAction',
        TestReducer['metadata']
      > = {
        type: 'testSavePartialReducerMetadataAction',
        partialReducerMetadata: {},
      };

      const newState = duplicateState<
        'testSavePartialReducerMetadataAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialReducerMetadataAction);

      expect(newState.data[state.getPk(testEntity1)]).toBe(
        state.data[state.getPk(testEntity1)],
      );
      expect(newState.data[state.getPk(testEntity2)]).toBe(
        state.data[state.getPk(testEntity2)],
      );
      expect(newState.data[state.getPk(testEntity3)]).toBe(
        state.data[state.getPk(testEntity3)],
      );
    });

    it('Should duplicate affected entities by save whole entities action', () => {
      const testSaveWholeEntitiesAction: SaveWholeEntitiesAction<
        'testSaveWholeEntitiesAction',
        TestEntity,
        TestReducer['metadata']
      > = {
        type: 'testSaveWholeEntitiesAction',
        wholeEntities: {
          [getPkOfEntity(testEntity1, testPkSchema)]: testEntity1,
          [getPkOfEntity(testEntity2, testPkSchema)]: testEntity2,
        },
      };

      const newState = duplicateState<
        'testSaveWholeEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSaveWholeEntitiesAction);

      expect(newState.data[state.getPk(testEntity1)]).not.toBe(
        state.data[state.getPk(testEntity1)],
      );
      expect(newState.data[state.getPk(testEntity2)]).not.toBe(
        state.data[state.getPk(testEntity2)],
      );
      expect(newState.data[state.getPk(testEntity3)]).toBe(
        state.data[state.getPk(testEntity3)],
      );
    });

    it('Should duplicate affected entities by save partial entities action', () => {
      const testSavePartialEntitiesAction: SavePartialEntitiesAction<
        'testSavePartialEntitiesAction',
        TestEntity,
        TestReducer['metadata']
      > = {
        type: 'testSavePartialEntitiesAction',
        partialEntities: {
          [getPkOfEntity(testEntity1, testPkSchema)]: testEntity1,
          [getPkOfEntity(testEntity3, testPkSchema)]: testEntity3,
        },
      };

      const newState = duplicateState<
        'testSavePartialEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialEntitiesAction);

      expect(newState.data[state.getPk(testEntity1)]).not.toBe(
        state.data[state.getPk(testEntity1)],
      );
      expect(newState.data[state.getPk(testEntity2)]).toBe(
        state.data[state.getPk(testEntity2)],
      );
      expect(newState.data[state.getPk(testEntity3)]).not.toBe(
        state.data[state.getPk(testEntity3)],
      );
    });

    it('Should duplicate affected entities by save partial pattern to entities action', () => {
      const testSavePartialPatternToEntitiesAction: SavePartialPatternToEntitiesAction<
        'testSavePartialPatternToEntitiesAction',
        TestEntity,
        TestReducer['metadata']
      > = {
        type: 'testSavePartialPatternToEntitiesAction',
        entityPks: [
          getPkOfEntity(testEntity2, testPkSchema),
          getPkOfEntity(testEntity3, testPkSchema),
        ],
        partialEntity: {},
      };

      const newState = duplicateState<
        'testSavePartialPatternToEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialPatternToEntitiesAction);

      expect(newState.data[state.getPk(testEntity1)]).toBe(
        state.data[state.getPk(testEntity1)],
      );
      expect(newState.data[state.getPk(testEntity2)]).not.toBe(
        state.data[state.getPk(testEntity2)],
      );
      expect(newState.data[state.getPk(testEntity3)]).not.toBe(
        state.data[state.getPk(testEntity3)],
      );
    });

    it('Should duplicate affected entities by delete entities action', () => {
      const testDeleteEntitiesAction: DeleteEntitiesAction<
        'testDeleteEntitiesAction',
        TestReducer['metadata']
      > = {
        type: 'testDeleteEntitiesAction',
        entityPks: [
          getPkOfEntity(testEntity1, testPkSchema),
          getPkOfEntity(testEntity2, testPkSchema),
        ],
      };

      const newState = duplicateState<
        'testDeleteEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testDeleteEntitiesAction);

      expect(newState.data[state.getPk(testEntity1)]).not.toBe(
        state.data[state.getPk(testEntity1)],
      );
      expect(newState.data[state.getPk(testEntity2)]).not.toBe(
        state.data[state.getPk(testEntity2)],
      );
      expect(newState.data[state.getPk(testEntity3)]).toBe(
        state.data[state.getPk(testEntity3)],
      );
    });

    it('Should not duplicate entities for fail action', () => {
      const testFailAction: FailAction<'testFailAction'> = {
        type: 'testFailAction',
        error: 'test fail action error',
        requestId: 'testFailActionRequestId',
      };

      const newState = duplicateState<
        'testFailAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testFailAction);

      expect(newState.data[state.getPk(testEntity1)]).toBe(
        state.data[state.getPk(testEntity1)],
      );
      expect(newState.data[state.getPk(testEntity2)]).toBe(
        state.data[state.getPk(testEntity2)],
      );
      expect(newState.data[state.getPk(testEntity3)]).toBe(
        state.data[state.getPk(testEntity3)],
      );
    });
  });

  describe('handleCommonProps', () => {
    it('Should handle SavePartialReducerMetadataAction', () => {
      const testSavePartialReducerMetadataAction: SavePartialReducerMetadataAction<
        'testSavePartialReducerMetadataAction',
        TestReducer['metadata']
      > = {
        type: 'testSavePartialReducerMetadataAction',
        partialReducerMetadata: {
          reducerStatus: 'savedPartialReducerMetadata',
        },
        requestId: 'testSavePartialReducerMetadataActionRequestId',
        subRequests: [
          { reducerName: 'testReducer', requestId: 'testRequestId' },
        ],
        statusCode: 200,
      };

      state.requests[
        testSavePartialReducerMetadataAction.requestId as string
      ] = {
        id: testSavePartialReducerMetadataAction.requestId as string,
        createdAt: {
          unixMilliseconds: createdDate.valueOf(),
        },
        isPending: true,
      };

      const initialRequest =
        state.requests[
          testSavePartialReducerMetadataAction.requestId as string
        ];
      const initialMetadata = state.metadata;

      handleCommonProps<
        'testSavePartialReducerMetadataAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialReducerMetadataAction);

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            [testSavePartialReducerMetadataAction.requestId as string]: {
              id: testSavePartialReducerMetadataAction.requestId as string,
              createdAt: {
                unixMilliseconds: createdDate.valueOf(),
              },
              completedAt: {
                unixMilliseconds: expect.any(Number),
              },
              isPending: false,
              isOk: true,
              statusCode: testSavePartialReducerMetadataAction.statusCode,
              subRequests: testSavePartialReducerMetadataAction.subRequests,
            },
          },
          metadata: {
            ...testInitialReducerMetadata,
            ...testSavePartialReducerMetadataAction.partialReducerMetadata,
          },
        }),
      );
      expect(
        state.requests[
          testSavePartialReducerMetadataAction.requestId as string
        ],
      ).not.toBe(initialRequest);
      expect(state.metadata).not.toBe(initialMetadata);
    });

    it('Should handle SaveWholeEntitiesAction', () => {
      const testSaveWholeEntitiesAction: SaveWholeEntitiesAction<
        'testSaveWholeEntitiesAction',
        TestEntity,
        TestReducer['metadata']
      > = {
        type: 'testSaveWholeEntitiesAction',
        wholeEntities: {
          [getPkOfEntity(testEntity1, testPkSchema)]: testEntity1,
          [getPkOfEntity(testEntity2, testPkSchema)]: testEntity2,
        },
        partialReducerMetadata: {
          reducerStatus: 'savedWholeEntities',
        },
        requestId: 'testSaveWholeEntitiesActionRequestId',
        subRequests: [
          { reducerName: 'testReducer', requestId: 'testRequestId' },
        ],
        statusCode: 200,
      };

      state.requests[testSaveWholeEntitiesAction.requestId as string] = {
        id: testSaveWholeEntitiesAction.requestId as string,
        createdAt: {
          unixMilliseconds: createdDate.valueOf(),
        },
        isPending: true,
      };

      handleCommonProps<
        'testSaveWholeEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSaveWholeEntitiesAction);

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            [testSaveWholeEntitiesAction.requestId as string]: {
              id: testSaveWholeEntitiesAction.requestId as string,
              createdAt: {
                unixMilliseconds: createdDate.valueOf(),
              },
              completedAt: {
                unixMilliseconds: expect.any(Number),
              },
              isPending: false,
              isOk: true,
              entityPks: Object.keys(testSaveWholeEntitiesAction.wholeEntities),
              statusCode: testSaveWholeEntitiesAction.statusCode,
              subRequests: testSaveWholeEntitiesAction.subRequests,
            },
          },
          metadata: {
            ...testInitialReducerMetadata,
            ...testSaveWholeEntitiesAction.partialReducerMetadata,
          },
        }),
      );
    });

    it('Should handle SavePartialEntitiesAction', () => {
      const testSavePartialEntitiesAction: SavePartialEntitiesAction<
        'testSavePartialEntitiesAction',
        TestEntity,
        TestReducer['metadata']
      > = {
        type: 'testSavePartialEntitiesAction',
        partialEntities: {
          [getPkOfEntity(testEntity1, testPkSchema)]: testEntity1,
          [getPkOfEntity(testEntity2, testPkSchema)]: testEntity2,
        },
        partialReducerMetadata: {
          reducerStatus: 'savedPartialEntities',
        },
        requestId: 'testSavePartialEntitiesActionRequestId',
        subRequests: [
          { reducerName: 'testReducer', requestId: 'testRequestId' },
        ],
        statusCode: 200,
      };

      state.requests[testSavePartialEntitiesAction.requestId as string] = {
        id: testSavePartialEntitiesAction.requestId as string,
        createdAt: {
          unixMilliseconds: createdDate.valueOf(),
        },
        isPending: true,
      };

      handleCommonProps<
        'testSavePartialEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialEntitiesAction);

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            [testSavePartialEntitiesAction.requestId as string]: {
              id: testSavePartialEntitiesAction.requestId as string,
              createdAt: {
                unixMilliseconds: createdDate.valueOf(),
              },
              completedAt: {
                unixMilliseconds: expect.any(Number),
              },
              isPending: false,
              isOk: true,
              entityPks: Object.keys(
                testSavePartialEntitiesAction.partialEntities,
              ),
              statusCode: testSavePartialEntitiesAction.statusCode,
              subRequests: testSavePartialEntitiesAction.subRequests,
            },
          },
          metadata: {
            ...testInitialReducerMetadata,
            ...testSavePartialEntitiesAction.partialReducerMetadata,
          },
        }),
      );
    });

    it('Should handle SavePartialPatternToEntitiesAction', () => {
      const testSavePartialPatternToEntitiesAction: SavePartialPatternToEntitiesAction<
        'testSavePartialPatternToEntitiesAction',
        TestEntity,
        TestReducer['metadata']
      > = {
        type: 'testSavePartialPatternToEntitiesAction',
        entityPks: [
          getPkOfEntity(testEntity1, testPkSchema),
          getPkOfEntity(testEntity2, testPkSchema),
        ],
        partialEntity: {},
        partialReducerMetadata: {
          reducerStatus: 'savedPartialPatternToEntities',
        },
        requestId: 'testSavePartialPatternToEntitiesActionRequestId',
        subRequests: [
          { reducerName: 'testReducer', requestId: 'testRequestId' },
        ],
        statusCode: 200,
      };

      state.requests[
        testSavePartialPatternToEntitiesAction.requestId as string
      ] = {
        id: testSavePartialPatternToEntitiesAction.requestId as string,
        createdAt: {
          unixMilliseconds: createdDate.valueOf(),
        },
        isPending: true,
      };

      handleCommonProps<
        'testSavePartialPatternToEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialPatternToEntitiesAction);

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            ...state.requests,
            [testSavePartialPatternToEntitiesAction.requestId as string]: {
              id: testSavePartialPatternToEntitiesAction.requestId as string,
              createdAt: {
                unixMilliseconds: createdDate.valueOf(),
              },
              completedAt: {
                unixMilliseconds: expect.any(Number),
              },
              isPending: false,
              isOk: true,
              entityPks: testSavePartialPatternToEntitiesAction.entityPks,
              statusCode: testSavePartialPatternToEntitiesAction.statusCode,
              subRequests: testSavePartialPatternToEntitiesAction.subRequests,
            },
          },
          metadata: {
            ...testInitialReducerMetadata,
            ...testSavePartialPatternToEntitiesAction.partialReducerMetadata,
          },
        }),
      );
    });

    it('Should handle DeleteEntitiesAction', () => {
      const testDeleteEntitiesAction: DeleteEntitiesAction<
        'testDeleteEntitiesAction',
        TestReducer['metadata']
      > = {
        type: 'testDeleteEntitiesAction',
        entityPks: [
          getPkOfEntity(testEntity1, testPkSchema),
          getPkOfEntity(testEntity2, testPkSchema),
        ],
        partialReducerMetadata: {
          reducerStatus: 'deletedEntities',
        },
        requestId: 'testDeleteEntitiesActionRequestId',
        subRequests: [
          { reducerName: 'testReducer', requestId: 'testRequestId' },
        ],
        statusCode: 200,
      };

      state.requests[testDeleteEntitiesAction.requestId as string] = {
        id: testDeleteEntitiesAction.requestId as string,
        createdAt: {
          unixMilliseconds: createdDate.valueOf(),
        },
        isPending: true,
      };

      handleCommonProps<
        'testDeleteEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testDeleteEntitiesAction);

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            ...state.requests,
            [testDeleteEntitiesAction.requestId as string]: {
              id: testDeleteEntitiesAction.requestId as string,
              createdAt: {
                unixMilliseconds: createdDate.valueOf(),
              },
              completedAt: {
                unixMilliseconds: expect.any(Number),
              },
              isPending: false,
              isOk: true,
              entityPks: testDeleteEntitiesAction.entityPks,
              statusCode: testDeleteEntitiesAction.statusCode,
              subRequests: testDeleteEntitiesAction.subRequests,
            },
          },
          metadata: {
            ...testInitialReducerMetadata,
            ...testDeleteEntitiesAction.partialReducerMetadata,
          },
        }),
      );
    });

    it('Should handle FailAction', () => {
      const testFailAction: FailAction<'testFailAction'> = {
        type: 'testFailAction',
        error: 'test fail action error',
        requestId: 'testFailActionRequestId',
        statusCode: 500,
      };

      state.requests[testFailAction.requestId as string] = {
        id: testFailAction.requestId as string,
        createdAt: {
          unixMilliseconds: createdDate.valueOf(),
        },
        isPending: true,
      };

      handleCommonProps<'testFailAction', TestReducer['metadata'], TestEntity>(
        state,
        testFailAction,
      );

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            [testFailAction.requestId as string]: {
              id: testFailAction.requestId as string,
              createdAt: {
                unixMilliseconds: createdDate.valueOf(),
              },
              completedAt: {
                unixMilliseconds: expect.any(Number),
              },
              isPending: false,
              isOk: false,
              statusCode: testFailAction.statusCode,
              error: testFailAction.error,
            },
          },
        }),
      );
    });

    describe('state.config.requestsPrettyTimestamps', () => {
      let testFailAction: FailAction<'testFailAction'>;

      beforeEach(() => {
        testFailAction = {
          type: 'testFailAction',
          error: 'test fail action error',
          requestId: 'testFailActionRequestId',
          statusCode: 500,
        };

        state.requests[testFailAction.requestId as string] = {
          id: testFailAction.requestId as string,
          createdAt: {
            unixMilliseconds: createdDate.valueOf(),
          },
          isPending: true,
        };
      });

      it("Should format string of request's timestamps to ISO string with UTC timezone", () => {
        state.config = {
          ...defaultReducerConfig,
          requestsPrettyTimestamps: {
            format: 'utc',
            timezone: 'utc',
          },
        };

        handleCommonProps<
          'testFailAction',
          TestReducer['metadata'],
          TestEntity
        >(state, testFailAction);

        const requestCompletedAt = state.requests[
          testFailAction.requestId as string
        ].completedAt as {
          unixMilliseconds: number;
          formattedString?: string;
        };
        const completedDate = new Date(requestCompletedAt.unixMilliseconds);
        expect(requestCompletedAt.formattedString).toBe(
          completedDate.toISOString(),
        );
      });
    });
  });

  describe('updateCompletedRequestsCache', () => {
    beforeEach(() => {
      state.requests = {
        request1: {
          id: 'request1',
          createdAt: {
            unixMilliseconds: 1,
          },
          isPending: true,
        },
        request2: {
          id: 'request2',
          createdAt: {
            unixMilliseconds: 2,
          },
          completedAt: {
            unixMilliseconds: 2,
          },
          isPending: false,
          isOk: true,
        },
        request3: {
          id: 'request3',
          createdAt: {
            unixMilliseconds: 3,
          },
          completedAt: {
            unixMilliseconds: 3,
          },
          isPending: false,
          isOk: true,
        },
        request4: {
          id: 'request4',
          createdAt: {
            unixMilliseconds: 4,
          },
          completedAt: {
            unixMilliseconds: 4,
          },
          isPending: false,
          isOk: true,
        },
        request5: {
          id: 'request5',
          createdAt: {
            unixMilliseconds: 5,
          },
          completedAt: {
            unixMilliseconds: 5,
          },
          isPending: false,
          isOk: false,
        },
        request6: {
          id: 'request6',
          createdAt: {
            unixMilliseconds: 6,
          },
          completedAt: {
            unixMilliseconds: 6,
          },
          isPending: false,
          isOk: false,
        },
        request7: {
          id: 'request7',
          createdAt: {
            unixMilliseconds: 7,
          },
          completedAt: {
            unixMilliseconds: 7,
          },
          isPending: false,
          isOk: false,
        },
      };
    });

    it('Should keep all success and fail requests', () => {
      state.config.successRequestsCache = null;
      state.config.failRequestsCache = null;

      updateCompletedRequestsCache<TestReducer['metadata'], TestEntity>(state);

      expect(Object.keys(state.requests).sort()).toEqual([
        'request1',
        'request2',
        'request3',
        'request4',
        'request5',
        'request6',
        'request7',
      ]);
    });

    it('Should keep 0 success requests', () => {
      state.config.successRequestsCache = 0;
      state.config.failRequestsCache = null;

      updateCompletedRequestsCache<TestReducer['metadata'], TestEntity>(state);

      expect(Object.keys(state.requests).sort()).toEqual([
        'request1',
        'request5',
        'request6',
        'request7',
      ]);
    });

    it('Should keep 0 fail requests', () => {
      state.config.successRequestsCache = null;
      state.config.failRequestsCache = 0;

      updateCompletedRequestsCache<TestReducer['metadata'], TestEntity>(state);

      expect(Object.keys(state.requests).sort()).toEqual([
        'request1',
        'request2',
        'request3',
        'request4',
      ]);
    });

    it('Should keep the 2 latest success and fail requests', () => {
      state.config.successRequestsCache = 2;
      state.config.failRequestsCache = 2;

      updateCompletedRequestsCache<TestReducer['metadata'], TestEntity>(state);

      expect(Object.keys(state.requests).sort()).toEqual([
        'request1',
        'request3',
        'request4',
        'request6',
        'request7',
      ]);
    });
  });
});
