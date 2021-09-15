import { keyBy, orderBy } from 'lodash';
import {
  DeleteEntitiesAction,
  FailAction,
  RequestAction,
  SaveNothingAction,
  SavePartialEntitiesAction,
  SavePartialPatternToEntitiesAction,
  SavePartialReducerMetadataAction,
  SaveWholeEntitiesAction,
  SaveWholeReducerMetadataAction,
} from '../types/actions.types';
import { Entity, Reducer, ReducerMetadata } from '../types/reducers.types';

/**
 * Duplicates the state object with shallow copies of the 'data', 'metadata',
 * and 'requests' props
 *
 * @param {Reducer} state - The current state of the reducer
 * @param {
 *          | RequestAction
 *          | SaveNothingaAction
 *          | SaveWholeReducerMetadataAction
 *          | SavePartialReducerMetadataAction
 *          | SaveWholeEntitiesAction
 *          | SavePartialEntitiesAction
 *          | SavePartialPatternToEntitiesAction
 *          | DeleteEntitiesAction
 *          | FailAction
 *        } action - Action to handle
 * @returns {Reducer} Duplicated state object
 */
export function duplicateState<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
>(
  state: Reducer<ReducerMetadataT, EntityT>,
  action: // @typescript-eslint/no-explicit-any disabled because the
  // RequestMetadata type is irrelevant for this function and it needs to be
  // able to take any request action regardless of its RequestMetadata
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | RequestAction<ActionTypeT, any>
    | SaveNothingAction<ActionTypeT>
    | SaveWholeReducerMetadataAction<ActionTypeT, ReducerMetadataT>
    | SavePartialReducerMetadataAction<ActionTypeT, ReducerMetadataT>
    | SaveWholeEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>
    | SavePartialEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>
    | SavePartialPatternToEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>
    | DeleteEntitiesAction<ActionTypeT, ReducerMetadataT>
    | FailAction<ActionTypeT>,
): Reducer<ReducerMetadataT, EntityT> {
  // The metadata object is not duplicated here since it gets duplicated in the
  // 'handleCommonProps' function, which should get called by every handler
  // that completes an action.
  const newState = {
    ...state,
    requests: { ...state.requests },
    data: Object.entries(state.data).reduce((stateData, [entityPk, entity]) => {
      let shouldDuplicateEntity = false;

      if ('wholeEntities' in action) {
        shouldDuplicateEntity = Object.keys(action.wholeEntities).includes(
          entityPk,
        );
      } else if ('partialEntities' in action) {
        shouldDuplicateEntity = Object.keys(action.partialEntities).includes(
          entityPk,
        );
      } else if ('entityPks' in action) {
        shouldDuplicateEntity = action.entityPks.includes(entityPk);
      }

      return {
        ...stateData,
        [entityPk]: shouldDuplicateEntity ? { ...entity } : entity,
      };
    }, {}),
  };

  return newState;
}

/**
 * Updates a reducer's props other than the 'data' prop for success and fail
 * actions.
 * The function mutates the passed state for two reasons:
 * 1. Because it is exclusively used by the other handlers in this file, all of
 * which have already created a copy of the redux state.
 * 2. To avoid an additional and unnecessary duplication of the redux state,
 * which could result in a reduction in performance in the application.
 *
 * @param {Reducer} newState - A copy of the redux state
 * @param {
 *          | SaveNothingAction
 *          | SaveWholeReducerMetadataAction
 *          | SavePartialReducerMetadataAction
 *          | SaveWholeEntitiesAction
 *          | SavePartialEntitiesAction
 *          | SavePartialPatternToEntitiesAction
 *          | DeleteEntitiesAction
 *          | FailAction
 *        } action - Success or fail action
 */
export function handleCommonProps<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
>(
  newState: Reducer<ReducerMetadataT, EntityT>,
  action:
    | SaveNothingAction<ActionTypeT>
    | SaveWholeReducerMetadataAction<ActionTypeT, ReducerMetadataT>
    | SavePartialReducerMetadataAction<ActionTypeT, ReducerMetadataT>
    | SaveWholeEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>
    | SavePartialEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>
    | SavePartialPatternToEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>
    | DeleteEntitiesAction<ActionTypeT, ReducerMetadataT>
    | FailAction<ActionTypeT>,
): void {
  // no-param-reassign is disabled because the state has already been
  // duplicated in the respective handler that calls this function hence the
  // risk of mutating the state object is already mitigated.
  /* eslint-disable no-param-reassign */
  if ('partialReducerMetadata' in action) {
    newState.metadata = {
      ...newState.metadata,
      ...action.partialReducerMetadata,
    };
  }

  if ('requestId' in action && action.requestId) {
    const completedDate = new Date();
    newState.requests[action.requestId] = {
      ...newState.requests[action.requestId],
      completedAt: {
        unixMilliseconds: completedDate.valueOf(),
      },
      isPending: false,
      isOk: !('error' in action),
    };

    if (newState.config.requestsPrettyTimestamps) {
      (
        newState.requests[action.requestId].completedAt as {
          unixMilliseconds: number;
          formattedString?: string;
        }
      ).formattedString = completedDate.toISOString();
    }

    if ('wholeEntities' in action) {
      newState.requests[action.requestId].entityPks = Object.keys(
        action.wholeEntities,
      );
    } else if ('partialEntities' in action) {
      newState.requests[action.requestId].entityPks = Object.keys(
        action.partialEntities,
      );
    } else if ('entityPks' in action) {
      newState.requests[action.requestId].entityPks = action.entityPks;
    }

    if ('statusCode' in action) {
      newState.requests[action.requestId].statusCode = action.statusCode;
    }
    if ('subRequests' in action) {
      newState.requests[action.requestId].subRequests = action.subRequests;
    }
    if ('error' in action) {
      newState.requests[action.requestId].error = action.error;
    }
  }
  /* eslint-enable no-param-reassign */
}

/**
 * Updates a reducer's completed requests cache. That is, removes the oldest
 * completed requests according to the reducer config's 'successRequestsCache'
 * and 'failRequestsCache' params.
 *
 * @param {Reducer} newState - A copy of the redux state
 */
export function updateCompletedRequestsCache<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
>(newState: Reducer<ReducerMetadataT, EntityT>): void {
  if (
    newState.config.successRequestsCache === null &&
    newState.config.failRequestsCache === null
  ) {
    return;
  }

  const pendingRequests = Object.values(newState.requests).filter(
    (request) => request.isPending,
  );
  const completedRequests = Object.values(newState.requests).filter(
    (request) => !request.isPending,
  );
  let successRequests = completedRequests.filter((request) => request.isOk);
  let failRequests = completedRequests.filter((request) => !request.isOk);

  if (
    newState.config.successRequestsCache !== null &&
    successRequests.length > newState.config.successRequestsCache
  ) {
    const sortedSuccessRequests = orderBy(
      successRequests,
      (successRequest) => successRequest.completedAt?.unixMilliseconds,
      'desc',
    );

    const successRequestsCache = sortedSuccessRequests.slice(
      0,
      newState.config.successRequestsCache,
    );

    successRequests = successRequestsCache;
  }

  if (
    newState.config.failRequestsCache !== null &&
    failRequests.length > newState.config.failRequestsCache
  ) {
    const sortedFailRequests = orderBy(
      failRequests,
      (failRequest) => failRequest.completedAt?.unixMilliseconds,
      'desc',
    );

    const failRequestsCache = sortedFailRequests.slice(
      0,
      newState.config.failRequestsCache,
    );

    failRequests = failRequestsCache;
  }

  // no-param-reassign is disabled because the state has already been
  // duplicated in the respective handler that calls this function hence the
  // risk of mutating the state object is already mitigated.
  // eslint-disable-next-line no-param-reassign
  newState.requests = {
    ...keyBy(pendingRequests, 'id'),
    ...keyBy(successRequests, 'id'),
    ...keyBy(failRequests, 'id'),
  };
}
