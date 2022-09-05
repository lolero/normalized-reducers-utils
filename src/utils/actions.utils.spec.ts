import { testSaga } from 'redux-saga-test-plan';
import {
  getRequestActionTypePrefix,
  doesActionMatchRequest,
  wasRequestSuccessful,
  mySaga,
} from './actions.utils';

describe('action.utils', () => {
  describe('getRequestActionTypePrefix', () => {
    it('Should get request action type prefix', () => {
      const requestAction = {
        type: 'testRequestAction__REQUEST',
        requestId: 'testRequestActionRequestId',
      };
      const requestActionTypePrefix = getRequestActionTypePrefix(requestAction);

      expect(requestActionTypePrefix).toBe('testRequestAction');
    });
  });

  describe('doesActionMatchRequest', () => {
    it('Should match request for success action', () => {
      const requestAction = {
        type: 'testRequestAction__REQUEST',
        requestId: 'testRequestActionRequestId',
      };
      const action = {
        type: `${getRequestActionTypePrefix(requestAction)}__SUCCESS`,
        requestId: requestAction.requestId,
      };

      expect(doesActionMatchRequest(requestAction, action)).toBe(true);
    });

    it('Should match request for fail action', () => {
      const requestAction = {
        type: 'testRequestAction__REQUEST',
        requestId: 'testRequestActionRequestId',
      };
      const action = {
        type: `${getRequestActionTypePrefix(requestAction)}__FAIL`,
        requestId: requestAction.requestId,
      };

      expect(doesActionMatchRequest(requestAction, action)).toBe(true);
    });

    it('Should not match request if request ids are different', () => {
      const requestAction = {
        type: 'testRequestAction__REQUEST',
        requestId: 'testRequestActionRequestId',
      };
      const action = {
        type: `${getRequestActionTypePrefix(requestAction)}__SUCCESS`,
        requestId: 'randomRequestId',
      };

      expect(doesActionMatchRequest(requestAction, action)).toBe(false);
    });

    it('Should not match request if request type prefixes are different', () => {
      const requestAction = {
        type: 'testRequestAction__REQUEST',
        requestId: 'testRequestActionRequestId',
      };
      const action = {
        type: 'randomPrefix__SUCCESS',
        requestId: requestAction.requestId,
      };

      expect(doesActionMatchRequest(requestAction, action)).toBe(false);
    });
  });

  describe('wasRequestSuccessful', () => {
    it.skip('Should return true for corresponding success action', () => {
      const requestAction = {
        type: 'testRequestAction__REQUEST',
        requestId: 'testRequestId',
      };

      testSaga(wasRequestSuccessful, requestAction)
        .next()
        .call(getRequestActionTypePrefix, requestAction)
        .next(getRequestActionTypePrefix(requestAction))
        .take()
        .next({ type: 'testRequestAction__SUCCESS' })
        .returns(true)
        .finish();
    });

    it.skip('Should return false for corresponding fail action', () => {
      const requestAction = {
        type: 'testRequestAction__REQUEST',
        requestId: 'testRequestId',
      };

      testSaga(wasRequestSuccessful, requestAction)
        .next()
        .call(getRequestActionTypePrefix, requestAction)
        .next(getRequestActionTypePrefix(requestAction))
        .take()
        .next({ type: 'testRequestAction__FAIL' })
        .returns(true)
        .finish();
    });

    it.skip('Should test mySaga', () => {
      testSaga(mySaga, { type: 'myActionType' }).next().take().next().finish();
    });
  });
});
