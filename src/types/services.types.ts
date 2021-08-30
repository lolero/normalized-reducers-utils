import { Entity } from './reducers.types';

export type CreateOneServiceResponse<EntityT extends Entity> = {
  data?: EntityT;
  status: number;
};

export type GetManyServiceResponse<EntityT extends Entity> = {
  data: EntityT[];
  status: number;
};

export type GetOneServiceResponse<EntityT extends Entity> = {
  data: EntityT;
  status: number;
};

export type UpdateOneWholeServiceResponse<EntityT extends Entity> = {
  data?: EntityT;
  status: number;
};

export type UpdateOnePartialServiceResponse<EntityT extends Entity> = {
  data?: EntityT;
  status: number;
};
