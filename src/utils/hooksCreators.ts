import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { pick } from 'lodash';
import { ReducerSelectors } from '../types/selectors.types';
import {
  Entity,
  ReducerGroup,
  ReducerMetadata,
  Request,
} from '../types/reducers.types';
import { ReducerHooks } from '../types/hooks.types';

/**
 * Creates React hooks to retrieve a reducer's props, as well as individual
 * requests and entities.
 *
 * @param {ReducerSelectors} reducerSelectors - The reducerSelectors object for
 *        the reducer's props
 * @returns {ReducerHooks} React hooks for the reducer's props, as well as
 *          individual requests and entities.
 */
export function createReducerHooks<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity,
  ReducerPathT extends string[],
  ReduxState extends ReducerGroup<ReducerMetadataT, EntityT, ReducerPathT>,
>(
  reducerSelectors: ReducerSelectors<
    ReducerMetadataT,
    EntityT,
    ReducerPathT,
    ReduxState
  >,
): ReducerHooks<ReducerMetadataT, EntityT> {
  const { selectRequests, selectMetadata, selectData, selectConfig } =
    reducerSelectors;

  /**
   * React hook to retrieve an individual request from the reducer's requests
   * prop.
   *
   * @param {string} requestId - The ID of the request being fetched
   * @returns {Request} The request being fetched
   */
  function useRequest(requestId: string) {
    const reducerRequests = useSelector(selectRequests);

    const request = useMemo(
      () => reducerRequests[requestId],
      [reducerRequests, requestId],
    );

    return request;
  }

  /**
   * React hook to retrieve multiple requests from the reducer's requests prop.
   *
   * @param {string[] | undefined} requestIds - The IDs of the requests being
   *        fetched. 'undefined' if all requests are being fetched
   * @returns {Record<string, Request>} The requests being fetched
   */
  function useRequests(requestIds?: string[]) {
    const reducerRequests = useSelector(selectRequests);

    const requests = useMemo(() => {
      if (!requestIds) {
        return reducerRequests;
      }

      return pick(reducerRequests, requestIds);
    }, [reducerRequests, requestIds]);

    return requests;
  }

  /**
   * React hook to retrieve a reducer's metadata prop.
   *
   * @returns {ReducerMetadata} The reducer's metadata
   */
  function useReducerMetadata() {
    const reducerMetadata = useSelector(selectMetadata);

    return reducerMetadata;
  }

  /**
   * React hook to retrieve an individual entity from the reducer's data prop.
   *
   * @param {string} entityPk - The PK of the entity being fetched
   * @returns {Entity} The entity being fetched
   */
  function useEntity(entityPk: string) {
    const reducerData = useSelector(selectData);

    const entity = useMemo(
      () => reducerData[entityPk],
      [entityPk, reducerData],
    );

    return entity;
  }

  /**
   * React hook to retrieve multiple entities from the reducer's data prop.
   *
   * @param {string[] | undefined} entityPks - The PKs of the entities being
   *        fetched. 'undefined' if all entities are being fetched
   * @returns {Record<string, Entity>} The entities being fetched
   */
  function useEntities(entityPks?: string[]) {
    const reducerData = useSelector(selectData);

    const entities = useMemo(() => {
      if (!entityPks) {
        return reducerData;
      }

      return pick(reducerData, entityPks);
    }, [entityPks, reducerData]);

    return entities;
  }

  /**
   * React hook to retrieve a reducer's config prop.
   *
   * @returns {object} The reducer's config
   */
  function useReducerConfig() {
    const reducerConfig = useSelector(selectConfig);

    return reducerConfig;
  }

  return {
    useRequest,
    useRequests,
    useReducerMetadata,
    useEntity,
    useEntities,
    useReducerConfig,
  };
}
