import {
  TestEntity,
  testEntity1,
  testEntity2,
  testPkSchema,
} from './spec.utils';
import { createReducerPkUtils, destructPk, getPkOfEntity } from './pk.utils';
import { PkSchema } from '../types/reducers.types';

describe('pk.utils', () => {
  describe('getPkOfEntity', () => {
    it('Should get PK of entity with only fields', () => {
      const testPkSchema1: PkSchema<TestEntity, ['id', 'name'], []> = {
        fields: ['id', 'name'],
        edges: [],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity1, testPkSchema1);

      expect(entityPk).toBe(
        `${testEntity1.id}${testPkSchema1.separator}${testEntity1.name}`,
      );
    });

    it('Should get PK of entity with only edges', () => {
      const testPkSchema1: PkSchema<
        TestEntity,
        [],
        ['parent', 'emergencyContacts']
      > = {
        fields: [],
        edges: ['parent', 'emergencyContacts'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema1);

      expect(entityPk).toBe(
        `${testEntity2.__edges__.parent?.[0]}${testPkSchema1.separator}${testEntity2.__edges__?.emergencyContacts?.[0]}${testPkSchema1.subSeparator}${testEntity2.__edges__?.emergencyContacts?.[1]}`,
      );
    });

    it('Should get PK of entity with fields and edges', () => {
      const testPkSchema1: PkSchema<
        TestEntity,
        ['id', 'name'],
        ['parent', 'emergencyContacts']
      > = {
        fields: ['id', 'name'],
        edges: ['parent', 'emergencyContacts'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema1);

      expect(entityPk).toBe(
        `${testEntity2.id}${testPkSchema1.separator}${testEntity2.name}${testPkSchema1.separator}${testEntity2.__edges__.parent?.[0]}${testPkSchema1.separator}${testEntity2.__edges__?.emergencyContacts?.[0]}${testPkSchema1.subSeparator}${testEntity2.__edges__?.emergencyContacts?.[1]}`,
      );
    });
  });

  describe('destructPk', () => {
    it('Should destruct PK with only fields', () => {
      const testPkSchema1: PkSchema<TestEntity, ['id', 'name'], []> = {
        fields: ['id', 'name'],
        edges: [],
        separator: '_',
        subSeparator: '-',
      };

      const entityPk = getPkOfEntity(testEntity2, testPkSchema1);

      const destructedPk = destructPk(entityPk, testPkSchema1);

      expect(destructedPk).toEqual({
        fields: {
          id: testEntity2.id,
          name: testEntity2.name,
        },
        edges: {},
      });
    });

    it('Should destruct PK with only edges', () => {
      const testPkSchema1: PkSchema<
        TestEntity,
        [],
        ['parent', 'emergencyContacts']
      > = {
        fields: [],
        edges: ['parent', 'emergencyContacts'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema1);

      const destructedPk = destructPk<TestEntity, typeof testPkSchema1>(
        entityPk,
        testPkSchema1,
      );

      expect(destructedPk).toEqual({
        fields: {},
        edges: {
          parent: testEntity2.__edges__?.parent,
          emergencyContacts: testEntity2.__edges__?.emergencyContacts,
        },
      });
    });

    it('Should destruct PK with fields and edges', () => {
      const testPkSchema1: PkSchema<
        TestEntity,
        ['id', 'name'],
        ['parent', 'emergencyContacts']
      > = {
        fields: ['id', 'name'],
        edges: ['parent', 'emergencyContacts'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema1);

      const destructedPk = destructPk<TestEntity, typeof testPkSchema1>(
        entityPk,
        testPkSchema1,
      );

      expect(destructedPk).toEqual({
        fields: {
          id: testEntity2.id,
          name: testEntity2.name,
        },
        edges: {
          parent: testEntity2.__edges__?.parent,
          emergencyContacts: testEntity2.__edges__?.emergencyContacts,
        },
      });
    });
  });

  describe('createReducerPkUtils', () => {
    it('Should create reducer PK utils', () => {
      const reducerPkUtils = createReducerPkUtils<
        TestEntity,
        typeof testPkSchema
      >(testPkSchema);

      expect(reducerPkUtils).toEqual({
        pkSchema: testPkSchema,
        getPkOfEntity: expect.any(Function),
        destructPk: expect.any(Function),
      });

      const testEntity1Pk = getPkOfEntity(testEntity1, testPkSchema);

      expect(reducerPkUtils.getPkOfEntity(testEntity1)).toBe(testEntity1Pk);

      expect(reducerPkUtils.destructPk(testEntity1Pk)).toEqual(
        destructPk<TestEntity, typeof testPkSchema>(
          testEntity1Pk,
          testPkSchema,
        ),
      );
    });
  });
});
