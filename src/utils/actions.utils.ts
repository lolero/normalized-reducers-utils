import { call, CallEffect, take, TakeEffect } from 'redux-saga/effects';

/**
 * Get request action type prefix
 *
 * @param {{type: string; requestId: string}} requestAction - Request action
 * @param {string} requestAction.type - Request action type
 * @param {string} requestAction.requestId - Request action request ID
 * @returns {string} Request action type prefix
 */
export function getRequestActionTypePrefix(requestAction: {
  type: string;
  requestId: string;
}): string {
  return requestAction.type.split('__REQUEST')[0];
}

/**
 * Checks if success or fail action's type prefix and request ID match request
 * action
 *
 * @param {{type: string; requestId: string}} requestAction - Request action
 * @param {string} requestAction.type - Request action type
 * @param {string} requestAction.requestId - Request action request ID
 * @param {{type: string; requestId: string}} action - Action
 * @param {string} action.type - Action type
 * @param {string} action.requestId - Action request ID
 * @returns {boolean} Whether or not action matches request action
 */
export function doesActionMatchRequest(
  requestAction: { type: string; requestId: string },
  action: { type: string; requestId: string },
): boolean {
  const requestActionTypePrefix = getRequestActionTypePrefix(requestAction);
  return (
    action.requestId === requestAction.requestId &&
    (action.type === `${requestActionTypePrefix}__SUCCESS` ||
      action.type === `${requestActionTypePrefix}__FAIL`)
  );
}

/**
 * Waits for success or fail action to be dispatched, corresponding to a
 * request action, and returns whether or not the request was successful
 *
 * @param {{type: string; requestId: string}} requestAction - Request action
 * @param {string} requestAction.type - Request action type
 * @param {string} requestAction.requestId - Request action request ID
 * @returns {boolean} Whether or not request action was successful
 */
export function* wasRequestSuccessful(requestAction: {
  type: string;
  requestId: string;
}): Generator<CallEffect | TakeEffect, boolean, string | { type: string }> {
  const requestActionTypePrefix = (yield call(
    getRequestActionTypePrefix,
    requestAction,
  )) as string;
  // @typescript-eslint/no-explicit-any is disabled because I was not able to
  // find a type that worked with a redux saga's take effect that takes a
  // function pattern
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { type: resultActionType } = (yield take((action: any) =>
    doesActionMatchRequest(requestAction, action),
  )) as { type: string };
  return resultActionType === `${requestActionTypePrefix}__SUCCESS`;
}

/**
 * Test function
 *
 * @param {{type: string}} myAction - Test action
 * @param {string} myAction.type - Test action type
 * @returns {boolean} My saga result
 */
export function* mySaga(myAction: {
  type: string;
}): Generator<TakeEffect, boolean, { type: string }> {
  const { type: actionType } = (yield take(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (action: any) => action.type === myAction.type,
  )) as { type: string };
  return actionType === myAction.type;
}
