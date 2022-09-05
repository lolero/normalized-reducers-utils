import {
  DestructedPk,
  Entity,
  PkSchema,
  PkSchemaEdges,
  PkSchemaFields,
} from '../types/reducers.types';
import { ReducerPkUtils } from '../types/pk.types';

export const emptyPkSchema: PkSchema<Entity, [], []> = {
  fields: [],
  edges: [],
  separator: '',
  subSeparator: '',
};

/**
 * Get PK of entity
 *
 * @param {Entity} entity - Entity
 * @param {PkSchema} pkSchema - PK schema of reducer's entities
 * @returns {string} PK of entity
 */
export function getPkOfEntity<
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >,
>(entity: EntityT, pkSchema: PkSchemaT): string {
  const fields = pkSchema.fields.map(
    (field) => entity[field] as string | number,
  );
  const edges = pkSchema.edges.map((edge) =>
    entity.__edges__?.[edge as string]?.join(`${pkSchema.subSeparator}`),
  );

  return [...fields, ...edges].join(pkSchema.separator);
}

/**
 * Get fields and edges from entity's PK
 *
 * @param {string} pk - Entity's PK
 * @param {PkSchema} pkSchema - PK schema of reducer's entities
 * @returns {DestructedPk} Fields and edges from entity's PK
 */
export function destructPk<
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >,
>(pk: string, pkSchema: PkSchemaT): DestructedPk<EntityT, PkSchemaT> {
  const fieldsAndEdgesFromPk = {
    fields: pk
      .split(pkSchema.separator)
      .slice(0, pkSchema.fields.length)
      .reduce(
        (
          fields: DestructedPk<EntityT, PkSchemaT>['fields'],
          field,
          fieldIndex,
        ) => ({
          ...fields,
          [pkSchema.fields[fieldIndex]]: field,
        }),
        {} as DestructedPk<EntityT, PkSchemaT>['fields'],
      ),
    edges: pk
      .split(pkSchema.separator)
      .slice(pkSchema.fields.length)
      .reduce(
        (
          edges: DestructedPk<EntityT, PkSchemaT>['edges'],
          edge,
          edgeIndex,
        ) => ({
          ...edges,
          [pkSchema.edges[edgeIndex]]: edge.split(pkSchema.subSeparator),
        }),
        {} as DestructedPk<EntityT, PkSchemaT>['edges'],
      ),
  };
  return fieldsAndEdgesFromPk;
}

/**
 * Create reducer PK utils
 *
 * @param {PkSchema} pkSchema - PK schema of reducer's entities
 * @returns {object} PK utils
 */
export function createReducerPkUtils<
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >,
>(pkSchema: PkSchemaT): ReducerPkUtils<EntityT, PkSchemaT> {
  const reducerPkUtils: ReducerPkUtils<EntityT, PkSchemaT> = {
    pkSchema,
    getPkOfEntity: (entity): string => getPkOfEntity(entity, pkSchema),
    destructPk: (pk) => destructPk(pk, pkSchema),
  };

  return reducerPkUtils;
}
