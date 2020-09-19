import {
  Entity,
  PkSchema,
  PkSchemaEdges,
  PkSchemaFields,
  Reducer,
  ReducerMetadata,
  RequestMetadata,
} from '../types/reducers.types';
import {
  DeleteEntitiesAction,
  FailAction,
  RequestAction,
  SavePartialEntitiesAction,
  SavePartialPatternToEntitiesAction,
  SavePartialReducerMetadataAction,
  SaveWholeEntitiesAction,
} from '../types/actions.types';
import {
  duplicateState,
  handleCommonProps,
  updateCompletedRequestsCache,
} from './reducerHandlers.utils';

/**
 * Accessory function that simply calls handleCommonProps and
 * updateCompletedRequestsCache
 *
 * @param {Reducer} newState - A copy of the redux state
 * @param {SavePartialReducerMetadataAction
 *        | SaveWholeEntitiesAction
 *        | SavePartialEntitiesAction
 *        | SavePartialPatternToEntitiesAction
 *        | DeleteEntitiesAction
 *        | FailAction} action - Success or fail action
 */
function handleCompletedRequest<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(
  newState: Reducer<ReducerMetadataT, EntityT, PkSchemaT>,
  action:
    | SavePartialReducerMetadataAction<ActionTypeT, ReducerMetadataT>
    | SaveWholeEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>
    | SavePartialEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>
    | SavePartialPatternToEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>
    | DeleteEntitiesAction<ActionTypeT, ReducerMetadataT>
    | FailAction<ActionTypeT>,
): void {
  handleCommonProps<ActionTypeT, ReducerMetadataT, EntityT, PkSchemaT>(
    newState,
    action,
  );
  updateCompletedRequestsCache<ReducerMetadataT, EntityT, PkSchemaT>(newState);
}

/**
 * Updates a reducer's 'requests' prop and sets the 'isPending' property of
 * the request object, corresponding to the action's request id, to true.
 *
 * @param {Reducer} state - The current state of the reducer
 * @param {RequestAction} action - Request action
 *
 * @returns {Reducer} Updated reducer state
 */
export function handleRequest<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >,
  RequestMetadataT extends RequestMetadata
>(
  state: Reducer<ReducerMetadataT, EntityT, PkSchemaT>,
  action: RequestAction<ActionTypeT, RequestMetadataT>,
): Reducer<ReducerMetadataT, EntityT, PkSchemaT> {
  const createdDate = new Date();
  const newState = duplicateState<
    ActionTypeT,
    ReducerMetadataT,
    EntityT,
    PkSchemaT
  >(state, action);
  newState.requests[action.requestId] = {
    id: action.requestId,
    createdAt: {
      unixMilliseconds: createdDate.valueOf(),
    },
    isPending: true,
    metadata: action.requestMetadata,
  };

  if (state.config.requestsPrettyTimestamps) {
    newState.requests[
      action.requestId
    ].createdAt.formattedString = createdDate.toISOString();
  }

  return newState;
}

/**
 * Updates a subset of properties in a reducer's 'metadata' prop,
 * as well as the 'requests' prop to reflect that the corresponding request
 * has been completed successfully.
 *
 * @param {Reducer} state - The current state of the reducer
 * @param {SavePartialReducerMetadataAction} action - Save partial reducer
 *        metadata success action
 *
 * @returns {Reducer} Updated reducer state
 */
export function handleSavePartialReducerMetadata<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(
  state: Reducer<ReducerMetadataT, EntityT, PkSchemaT>,
  action: SavePartialReducerMetadataAction<ActionTypeT, ReducerMetadataT>,
): Reducer<ReducerMetadataT, EntityT, PkSchemaT> {
  const newState = duplicateState<
    ActionTypeT,
    ReducerMetadataT,
    EntityT,
    PkSchemaT
  >(state, action);
  handleCompletedRequest<ActionTypeT, ReducerMetadataT, EntityT, PkSchemaT>(
    newState,
    action,
  );

  return newState;
}

/**
 * Updates a reducer's 'data' prop with whole entities' data,
 * the 'metadata' prop with the corresponding partial reducer metadata,
 * and the 'requests' prop to reflect that the corresponding request has been
 * completed successfully.
 *
 * @param {Reducer} state - The current state of the reducer
 * @param {SaveWholeEntitiesAction} action - Save whole entities success action
 *
 * @returns {Reducer} Updated reducer state
 */
export function handleSaveWholeEntities<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(
  state: Reducer<ReducerMetadataT, EntityT, PkSchemaT>,
  action: SaveWholeEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>,
): Reducer<ReducerMetadataT, EntityT, PkSchemaT> {
  const newState = duplicateState<
    ActionTypeT,
    ReducerMetadataT,
    EntityT,
    PkSchemaT
  >(state, action);
  newState.data = action.flush
    ? action.wholeEntities
    : { ...newState.data, ...action.wholeEntities };
  handleCompletedRequest<ActionTypeT, ReducerMetadataT, EntityT, PkSchemaT>(
    newState,
    action,
  );

  return newState;
}

/**
 * Updates a subset of props in a reducer's entities,
 * as well as the 'requests' prop to reflect that the corresponding request
 * has been completed successfully. The '__edges__' prop of the entities is
 * not replaced completely. Instead, only the provided subset of __edges__ is
 * updated.
 *
 * @param {Reducer} state - The current state of the reducer
 * @param {SavePartialEntitiesAction} action - Save partial entity success
 *        action
 *
 * @returns {Reducer} Updated reducer state
 */
export function handleSavePartialEntities<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(
  state: Reducer<ReducerMetadataT, EntityT, PkSchemaT>,
  action: SavePartialEntitiesAction<ActionTypeT, ReducerMetadataT, EntityT>,
): Reducer<ReducerMetadataT, EntityT, PkSchemaT> {
  const newState = duplicateState<
    ActionTypeT,
    ReducerMetadataT,
    EntityT,
    PkSchemaT
  >(state, action);
  Object.keys(action.partialEntities).forEach((entityPk) => {
    newState.data[entityPk] = {
      ...newState.data[entityPk],
      ...action.partialEntities[entityPk],
      __edges__: newState.data[entityPk].__edges__,
    };
    if (action.partialEntities[entityPk].__edges__) {
      newState.data[entityPk].__edges__ = {
        ...newState.data[entityPk].__edges__,
        ...action.partialEntities[entityPk].__edges__,
      };
    }
  });
  handleCompletedRequest<ActionTypeT, ReducerMetadataT, EntityT, PkSchemaT>(
    newState,
    action,
  );

  return newState;
}

/**
 * Updates one subset of props in many reducers' entities,
 * as well as the 'requests' prop to reflect that the corresponding request
 * has been completed successfully. The '__edges__' prop of the entities is
 * not replaced completely. Instead, only the provided subset of __edges__ is
 * updated.
 *
 * @param {Reducer} state - The current state of the reducer
 * @param {SavePartialEntitiesAction} action - Save partial entity success
 *        action
 *
 * @returns {Reducer} Updated reducer state
 */
export function handleSavePartialPatternToEntities<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(
  state: Reducer<ReducerMetadataT, EntityT, PkSchemaT>,
  action: SavePartialPatternToEntitiesAction<
    ActionTypeT,
    ReducerMetadataT,
    EntityT
  >,
): Reducer<ReducerMetadataT, EntityT, PkSchemaT> {
  const newState = duplicateState<
    ActionTypeT,
    ReducerMetadataT,
    EntityT,
    PkSchemaT
  >(state, action);
  action.entityPks.forEach((entityPk) => {
    newState.data[entityPk] = {
      ...newState.data[entityPk],
      ...action.partialEntity,
      __edges__: newState.data[entityPk].__edges__,
    };
    if (action.partialEntity.__edges__) {
      newState.data[entityPk].__edges__ = {
        ...newState.data[entityPk].__edges__,
        ...action.partialEntity.__edges__,
      };
    }
  });
  handleCompletedRequest<ActionTypeT, ReducerMetadataT, EntityT, PkSchemaT>(
    newState,
    action,
  );

  return newState;
}

/**
 * Deletes a set of a reducer's entities,
 * as well as the 'requests' prop to reflect that the corresponding request
 * has been completed successfully.
 *
 * @param {Reducer} state - The current state of the reducer
 * @param {DeleteEntitiesAction} action - Delete entities success action
 *
 * @returns {Reducer} Updated reducer state
 */
export function handleDeleteEntities<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(
  state: Reducer<ReducerMetadataT, EntityT, PkSchemaT>,
  action: DeleteEntitiesAction<ActionTypeT, ReducerMetadataT>,
): Reducer<ReducerMetadataT, EntityT, PkSchemaT> {
  const newState = duplicateState<
    ActionTypeT,
    ReducerMetadataT,
    EntityT,
    PkSchemaT
  >(state, action);
  action.entityPks.forEach((entityPk) => delete newState.data[entityPk]);
  handleCompletedRequest<ActionTypeT, ReducerMetadataT, EntityT, PkSchemaT>(
    newState,
    action,
  );

  return newState;
}

/**
 * Updates a reducer's 'requests' prop to reflect that the corresponding
 * request has failed.
 *
 * @param {Reducer} state - The current state of the reducer
 * @param {FailAction} action - Fail action
 *
 * @returns {Reducer} Updated reducer state
 */
export function handleFail<
  ActionTypeT extends string,
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(
  state: Reducer<ReducerMetadataT, EntityT, PkSchemaT>,
  action: FailAction<ActionTypeT>,
): Reducer<ReducerMetadataT, EntityT, PkSchemaT> {
  const newState = duplicateState<
    ActionTypeT,
    ReducerMetadataT,
    EntityT,
    PkSchemaT
  >(state, action);
  handleCompletedRequest<ActionTypeT, ReducerMetadataT, EntityT, PkSchemaT>(
    newState,
    action,
  );

  return newState;
}
