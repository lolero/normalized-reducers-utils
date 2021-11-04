import {
  DestructedPk,
  Entity,
  PkSchema,
  PkSchemaEdges,
  PkSchemaFields,
} from './reducers.types';

export type ReducerPkUtils<
  EntityT extends Entity,
  PkSchemaT extends PkSchema<
    EntityT,
    PkSchemaFields<EntityT>,
    PkSchemaEdges<EntityT>
  >,
> = {
  pkSchema: PkSchemaT;
  getPkOfEntity: (entity: EntityT) => string;
  destructPk: (pk: string) => DestructedPk<EntityT, PkSchemaT>;
};
