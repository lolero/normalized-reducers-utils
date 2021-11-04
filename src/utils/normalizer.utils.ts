import {
  PkSchema,
  ReducerData,
  Entity,
  PkSchemaFields,
  PkSchemaEdges,
} from '../types/reducers.types';
import { getPkOfEntity } from './pk.utils';

/**
 * Convert entity array into a normalized entities object.
 *
 * @param {PkSchema} pkSchema - PK schema of reducer's entities
 * @param {Entity[]} entityArray - Entity array
 * @returns {ReducerData} Normalized entities object
 */
export function normalizeEntityArrayByPk<
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >,
>(pkSchema: PkSchemaT, entityArray: EntityT[]): ReducerData<EntityT> {
  const normalizedByPk = entityArray.reduce(
    (normalizedByPkTemp: ReducerData<EntityT>, entity) => ({
      ...normalizedByPkTemp,
      [getPkOfEntity(entity, pkSchema)]: entity,
    }),
    {},
  );
  return normalizedByPk;
}
