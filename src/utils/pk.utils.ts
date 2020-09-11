import { PkSchema, Entity, DestructuredPk } from '../types/reducers.types';

/**
 * Get PK of entity
 *
 * @param {Entity} entity - Entity
 * @param {PkSchema} pkSchema - PK schema of reducer's entities
 *
 * @returns {string} PK of entity
 */
export function getPkOfEntity<EntityT extends Entity>(
  entity: EntityT,
  pkSchema: PkSchema<EntityT>,
): string {
  const fields = pkSchema.fields.map(
    (field) => entity[field] as string | number,
  );
  const edges = pkSchema.edges.map(
    (edge) => entity.__edges__?.[edge as string]?.pks[0] as string,
  );

  return [...fields, ...edges].join(pkSchema.separator);
}

/**
 * Get fields and edges from entity's PK
 *
 * @param {string} pk - Entity's PK
 * @param {PkSchema} pkSchema - PK schema of reducer's entities
 *
 * @returns {DestructuredPk} Fields and edges from entity's PK
 */
export function destructurePk<EntityT extends Entity>(
  pk: string,
  pkSchema: PkSchema<EntityT>,
): DestructuredPk<EntityT> {
  const fieldsAndEdgesFromPk = {
    fields: pk
      .split(pkSchema.separator)
      .slice(0, pkSchema.fields.length)
      .reduce(
        (fields: { [field in keyof EntityT]?: string }, field, fieldIndex) => ({
          ...fields,
          [pkSchema.fields[fieldIndex]]: field,
        }),
        {},
      ),
    edges: pk
      .split(pkSchema.separator)
      .slice(pkSchema.fields.length)
      .reduce(
        (
          edges: { [edge in keyof EntityT['__edges__']]?: string },
          edge,
          edgeIndex,
        ) => ({
          ...edges,
          [pkSchema.edges[edgeIndex]]: edge,
        }),
        {},
      ),
  };
  return fieldsAndEdgesFromPk;
}
