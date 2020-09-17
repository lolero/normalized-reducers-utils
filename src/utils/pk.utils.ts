import {
  PkSchema,
  Entity,
  DestructedPk,
  PkSchemaFields,
  PkSchemaEdges,
} from '../types/reducers.types';

/**
 * Get PK of entity
 *
 * @param {Entity} entity - Entity
 * @param {PkSchema} pkSchema - PK schema of reducer's entities
 *
 * @returns {string} PK of entity
 */
export function getPkOfEntity<
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(entity: EntityT, pkSchema: PkSchemaT): string {
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
 * @returns {DestructedPk} Fields and edges from entity's PK
 */
export function destructPk<
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
>(pk: string, pkSchema: PkSchemaT): DestructedPk<EntityT, PkSchemaT> {
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
