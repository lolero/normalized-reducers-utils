import {
  testInitialReducerMetadata,
  TestEntity,
  testEntity1,
  testEntity2,
  testPkSchema,
  TestReducer,
} from '../tests.utils';
import { createInitialState } from '../initialState.utils';
import {
  duplicateState,
  handleCommonFields,
  updateCompletedRequestsCache,
} from '../reducerHandlers.utils';
import {
  SavePartialReducerMetadataAction,
  SaveWholeEntitiesAction,
  SavePartialEntitiesAction,
  SavePartialPatternToEntitiesAction,
  DeleteEntitiesAction,
  FailAction,
} from '../..';
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
    it('Should duplicate state', () => {
      state.data = { [state.getPk(testEntity1)]: testEntity1 };

      const newState = duplicateState<TestEntity, TestReducer['metadata']>(
        state,
      );

      expect(newState).toEqual(state);
      expect(newState).not.toBe(state);
      expect(newState.requests).not.toBe(state.requests);
      expect(newState.metadata).not.toBe(state.metadata);
      expect(newState.data).not.toBe(state.data);
      expect(newState.data[state.getPk(testEntity1)]).not.toBe(
        state.data[state.getPk(testEntity1)],
      );
    });
  });

  describe('handleCommonFields', () => {
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
        timestamp: {
          created: {
            unixMilliseconds: createdDate.valueOf(),
          },
        },
        pending: true,
      };

      handleCommonFields<
        'testSavePartialReducerMetadataAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialReducerMetadataAction);

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            [testSavePartialReducerMetadataAction.requestId as string]: {
              id: testSavePartialReducerMetadataAction.requestId as string,
              timestamp: {
                created: {
                  unixMilliseconds: createdDate.valueOf(),
                },
                completed: {
                  unixMilliseconds: expect.any(Number),
                },
              },
              pending: false,
              ok: true,
              statusCode: testSavePartialReducerMetadataAction.statusCode,
              subRequests: testSavePartialReducerMetadataAction.subRequests,
            },
          },
          metadata: {
            ...testInitialReducerMetadata,
            ...testSavePartialReducerMetadataAction.partialReducerMetadata,
          },
          data: {},
        }),
      );
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
          [getPkOfEntity(testEntity1, testPkSchema)]: testEntity2,
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
        timestamp: {
          created: {
            unixMilliseconds: createdDate.valueOf(),
          },
        },
        pending: true,
      };

      handleCommonFields<
        'testSaveWholeEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSaveWholeEntitiesAction);

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            [testSaveWholeEntitiesAction.requestId as string]: {
              id: testSaveWholeEntitiesAction.requestId as string,
              timestamp: {
                created: {
                  unixMilliseconds: createdDate.valueOf(),
                },
                completed: {
                  unixMilliseconds: expect.any(Number),
                },
              },
              pending: false,
              entityPks: Object.keys(testSaveWholeEntitiesAction.wholeEntities),
              ok: true,
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
          [getPkOfEntity(testEntity1, testPkSchema)]: testEntity2,
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
        timestamp: {
          created: {
            unixMilliseconds: createdDate.valueOf(),
          },
        },
        pending: true,
      };

      handleCommonFields<
        'testSavePartialEntitiesAction',
        TestReducer['metadata'],
        TestEntity
      >(state, testSavePartialEntitiesAction);

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            [testSavePartialEntitiesAction.requestId as string]: {
              id: testSavePartialEntitiesAction.requestId as string,
              timestamp: {
                created: {
                  unixMilliseconds: createdDate.valueOf(),
                },
                completed: {
                  unixMilliseconds: expect.any(Number),
                },
              },
              pending: false,
              entityPks: Object.keys(
                testSavePartialEntitiesAction.partialEntities,
              ),
              ok: true,
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
        timestamp: {
          created: {
            unixMilliseconds: createdDate.valueOf(),
          },
        },
        pending: true,
      };

      handleCommonFields<
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
              timestamp: {
                created: {
                  unixMilliseconds: createdDate.valueOf(),
                },
                completed: {
                  unixMilliseconds: expect.any(Number),
                },
              },
              pending: false,
              entityPks: testSavePartialPatternToEntitiesAction.entityPks,
              ok: true,
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
        timestamp: {
          created: {
            unixMilliseconds: createdDate.valueOf(),
          },
        },
        pending: true,
      };

      handleCommonFields<
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
              timestamp: {
                created: {
                  unixMilliseconds: createdDate.valueOf(),
                },
                completed: {
                  unixMilliseconds: expect.any(Number),
                },
              },
              pending: false,
              entityPks: testDeleteEntitiesAction.entityPks,
              ok: true,
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
        timestamp: {
          created: {
            unixMilliseconds: createdDate.valueOf(),
          },
        },
        pending: true,
      };

      handleCommonFields<'testFailAction', TestReducer['metadata'], TestEntity>(
        state,
        testFailAction,
      );

      expect(state).toEqual(
        expect.objectContaining({
          requests: {
            [testFailAction.requestId as string]: {
              id: testFailAction.requestId as string,
              timestamp: {
                created: {
                  unixMilliseconds: createdDate.valueOf(),
                },
                completed: {
                  unixMilliseconds: expect.any(Number),
                },
              },
              pending: false,
              ok: false,
              statusCode: testFailAction.statusCode,
              error: testFailAction.error,
            },
          },
        }),
      );
    });

    describe('state.config.requestsPrettyTimestamp', () => {
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
          timestamp: {
            created: {
              unixMilliseconds: createdDate.valueOf(),
            },
          },
          pending: true,
        };
      });

      it("Should format string of request's timestamp to ISO string with UTC timezone", () => {
        state.config = {
          requestsPrettyTimestamp: {
            format: 'utc',
            timezone: 'utc',
          },
        };

        handleCommonFields<
          'testFailAction',
          TestReducer['metadata'],
          TestEntity
        >(state, testFailAction);

        const requestCompletedTimestamp = state.requests[
          testFailAction.requestId as string
        ].timestamp.completed as {
          unixMilliseconds: number;
          formattedString?: string;
        };
        const completedDate = new Date(
          requestCompletedTimestamp.unixMilliseconds,
        );
        expect(requestCompletedTimestamp.formattedString).toBe(
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
          timestamp: {
            created: {
              unixMilliseconds: 1,
            },
          },
          pending: true,
        },
        request2: {
          id: 'request2',
          timestamp: {
            created: {
              unixMilliseconds: 2,
            },
            completed: {
              unixMilliseconds: 2,
            },
          },
          pending: false,
        },
        request3: {
          id: 'request3',
          timestamp: {
            created: {
              unixMilliseconds: 3,
            },
            completed: {
              unixMilliseconds: 3,
            },
          },
          pending: false,
        },
        request4: {
          id: 'request4',
          timestamp: {
            created: {
              unixMilliseconds: 4,
            },
            completed: {
              unixMilliseconds: 4,
            },
          },
          pending: false,
        },
      };
    });

    it('Should keep all completed requests', () => {
      state.config.completedRequestsCache = undefined;

      updateCompletedRequestsCache<TestReducer['metadata'], TestEntity>(state);

      expect(Object.keys(state.requests).sort()).toEqual([
        'request1',
        'request2',
        'request3',
        'request4',
      ]);
    });

    it('Should keep 0 completed requests', () => {
      state.config.completedRequestsCache = 0;

      updateCompletedRequestsCache<TestReducer['metadata'], TestEntity>(state);

      expect(Object.keys(state.requests).sort()).toEqual(['request1']);
    });

    it('Should keep the 2 latest completed requests', () => {
      state.config.completedRequestsCache = 2;

      updateCompletedRequestsCache<TestReducer['metadata'], TestEntity>(state);

      expect(Object.keys(state.requests).sort()).toEqual([
        'request1',
        'request3',
        'request4',
      ]);
    });
  });
});
