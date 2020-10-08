import {
  DestructedPk,
  Entity,
  PkSchema,
  PkSchemaEdges,
  PkSchemaFields,
  ReducerEdges,
  ReducerMetadata,
} from './reducers.types';

export type ReducerPkUtils<
  ReducerMetadataT extends ReducerMetadata,
  EntityT extends Entity<ReducerEdges>,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >
> = {
  pkSchema: PkSchemaT;
  getPkOfEntity: (entity: EntityT) => string;
  destructPk: (pk: string) => DestructedPk<EntityT, PkSchemaT>;
};
