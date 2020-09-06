import _ from 'lodash';
import {
  DeleteEntitiesAction,
  FailAction,
  SavePartialEntitiesAction,
  SavePartialPatternToEntitiesAction,
  SavePartialReducerMetadataAction,
  SaveWholeEntitiesAction,
} from '../types/actions.types';
import { Entity, Reducer, ReducerMetadata } from '../types/reducers.types';

/**
 * Duplicates the state object with shallow copies of the 'data', 'metadata',
 * and 'requests' fields
 *
 * @param {Reducer} state - The current state of the reducer
 *
 * @returns {Reducer} Duplicated state object
 */
export function duplicateState<
  EntityT extends Entity,
  ReducerMetadataT extends ReducerMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT>,
): Reducer<ReducerMetadataT, EntityT> {
  return {
    ...state,
    requests: { ...state.requests },
    metadata: { ...state.metadata },
    data: Object.entries(state.data).reduce(
      (stateData, [entityPk, entity]) => ({
        ...stateData,
        [entityPk]: { ...entity },
      }),
      {},
    ),
  };
}

/**
 * Updates a normalized reducer's fields other than the 'data' field for success
 * and fail actions.
 * The function mutates the passed state for two reasons:
 * 1. Because it is exclusively used by the other handlers in this file, all of
 * which have already created a copy of the redux state.
 * 2. To avoid an additional and unnecessary duplicaton of the redux state,
 * which could result in a reduction in performance in the application.
 *
 * @param {Reducer} newState - A copy of the redux state
 * @param {SavePartialReducerMetadataAction
 *        | SaveWholeEntitiesAction
 *        | SavePartialEntitiesAction
 *        | SavePartialPatternToEntitiesAction
 *        | DeleteEntitiesAction
 *        | FailAction} action - Success or fail action
 */
export function handleCommonFields<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity
>(
  newState: Reducer<ReducerMetadataT, EntityT>,
  action:
    | SavePartialReducerMetadataAction<ActionTypeT, ReducerMetadataT>
    | SaveWholeEntitiesAction<ActionTypeT, EntityT, ReducerMetadataT>
    | SavePartialEntitiesAction<ActionTypeT, EntityT, ReducerMetadataT>
    | SavePartialPatternToEntitiesAction<ActionTypeT, EntityT, ReducerMetadataT>
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
      id: action.requestId,
      timestamp: {
        ...newState.requests[action.requestId].timestamp,
        completed: {
          unixMilliseconds: completedDate.valueOf(),
        },
      },
      pending: false,
      ok: !('error' in action),
    };

    if (newState.config.requestsPrettyTimestamp) {
      (newState.requests[action.requestId].timestamp.completed as {
        unixMilliseconds: number;
        formattedString?: string;
      }).formattedString = completedDate.toISOString();
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
 * Updates a normalized reducer's completed requests cache. That is, removes
 * the oldest completed requests beyond the quantity set in the reducer config's
 * 'completedRequestsCache' param.
 *
 * @param {Reducer} newState - A copy of the redux state
 */
export function updateCompletedRequestsCache<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity
>(newState: Reducer<ReducerMetadataT, EntityT>): void {
  if (newState.config.completedRequestsCache !== undefined) {
    const pendingRequestIds = Object.values(newState.requests)
      .filter((request) => request.pending)
      .map((request) => request.id);
    const pendingRequests = _.pick(newState.requests, pendingRequestIds);

    const completedRequestIds = _.without(
      Object.keys(newState.requests),
      ...pendingRequestIds,
    );
    const completedRequests = _.pick(newState.requests, completedRequestIds);

    const sortedCompletedRequests = _.orderBy(
      completedRequests,
      (request) => request.timestamp.completed?.unixMilliseconds,
      'desc',
    );
    const completedRequestsCache = sortedCompletedRequests.slice(
      0,
      newState.config.completedRequestsCache,
    );

    // no-param-reassign is disabled because the state has already been
    // duplicated in the respective handler that calls this function hence the
    // risk of mutating the state object is already mitigated.
    // eslint-disable-next-line no-param-reassign
    newState.requests = {
      ..._.keyBy(pendingRequests, 'id'),
      ..._.keyBy(completedRequestsCache, 'id'),
    };
  }
}
