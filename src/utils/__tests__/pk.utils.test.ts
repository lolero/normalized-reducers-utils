import {
  TestEntity,
  testEntity1,
  testEntity2,
  testPkSchema,
  TestReducer,
} from '../tests.utils';
import { createReducerPkUtils, destructPk, getPkOfEntity } from '../pk.utils';
import { PkSchema } from '../../types/reducers.types';

describe('pk.utils', () => {
  describe('getPkOfEntity', () => {
    it('Should get PK of entity with only fields', () => {
      const testPkSchema1: PkSchema<TestEntity, ['id', 'name'], []> = {
        fields: ['id', 'name'],
        edges: [],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema1);

      expect(entityPk).toBe(
        `${testEntity2.id}${testPkSchema1.separator}${testEntity2.name}`,
      );
    });

    it('Should get PK of entity with only edges', () => {
      const testPkSchema1: PkSchema<TestEntity, [], ['parent', 'sibling']> = {
        fields: [],
        edges: ['parent', 'sibling'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema1);

      expect(entityPk).toBe(
        `${testEntity2.__edges__.parent?.pks[0]}${testPkSchema1.separator}${testEntity2.__edges__.sibling?.pks[0]}`,
      );
    });

    it('Should get PK of entity with fields and edges', () => {
      const testPkSchema1: PkSchema<
        TestEntity,
        ['id', 'name'],
        ['parent', 'sibling']
      > = {
        fields: ['id', 'name'],
        edges: ['parent', 'sibling'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema1);

      expect(entityPk).toBe(
        `${testEntity2.id}${testPkSchema1.separator}${testEntity2.name}${testPkSchema1.separator}${testEntity2.__edges__.parent?.pks[0]}${testPkSchema1.separator}${testEntity2.__edges__.sibling?.pks[0]}`,
      );
    });

    it('Should get PK of entity with fields and edges with multiple pks', () => {
      const testPkSchema1: PkSchema<
        TestEntity,
        ['id', 'name'],
        ['children']
      > = {
        fields: ['id', 'name'],
        edges: ['children'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity1, testPkSchema1);

      expect(entityPk).toBe(
        `${testEntity1.id}${testPkSchema1.separator}${testEntity1.name}${testPkSchema1.separator}${testEntity1.__edges__.children?.pks[0]}${testPkSchema1.subSeparator}${testEntity1.__edges__.children?.pks[1]}`,
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
      const testPkSchema1: PkSchema<TestEntity, [], ['parent', 'sibling']> = {
        fields: [],
        edges: ['parent', 'sibling'],
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
          parent: [testEntity2.__edges__.parent?.pks[0]],
          sibling: [testEntity2.__edges__.sibling?.pks[0]],
        },
      });
    });

    it('Should destruct PK with fields and edges', () => {
      const testPkSchema1: PkSchema<
        TestEntity,
        ['id', 'name'],
        ['parent', 'sibling']
      > = {
        fields: ['id', 'name'],
        edges: ['parent', 'sibling'],
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
          parent: [testEntity2.__edges__.parent?.pks[0]],
          sibling: [testEntity2.__edges__.sibling?.pks[0]],
        },
      });
    });

    it('Should destruct PK with fields and edges with multiple ids', () => {
      const testPkSchema1: PkSchema<
        TestEntity,
        ['id', 'name'],
        ['children']
      > = {
        fields: ['id', 'name'],
        edges: ['children'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity1, testPkSchema1);

      const destructedPk = destructPk<TestEntity, typeof testPkSchema1>(
        entityPk,
        testPkSchema1,
      );

      expect(destructedPk).toEqual({
        fields: {
          id: testEntity1.id,
          name: testEntity1.name,
        },
        edges: {
          children: testEntity1.__edges__.children?.pks,
        },
      });
    });
  });

  describe('createReducerPkUtils', () => {
    it('Should create reducer PK utils', () => {
      const reducerPkUtils = createReducerPkUtils<
        TestReducer['metadata'],
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
