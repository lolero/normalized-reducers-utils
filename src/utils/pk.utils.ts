import { PkSchema, Entity, FieldsFromPk } from '../types/reducers.types';

/**
 * Get PK of normalized reducer entity
 *
 * @param {Entity} entity - Entity
 * @param {PkSchema} pkSchema - PK schema of normalized reducer entity
 *
 * @returns {string} PK of normalized reducer entity
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
 * Get fields from normalized reducer entity's PK
 *
 * @param {string} pk - Normalized reducer entity's PK
 * @param {PkSchema} pkSchema - PK schema of normalized reducer entity
 *
 * @returns {FieldsFromPk} Fields from normalized reducer entity node's PK
 */
export function getFieldsFromPk<EntityT extends Entity>(
  pk: string,
  pkSchema: PkSchema<EntityT>,
): FieldsFromPk<EntityT> {
  const fieldsFromPk = {
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
  return fieldsFromPk;
}
