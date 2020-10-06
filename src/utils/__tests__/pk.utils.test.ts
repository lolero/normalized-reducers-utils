import { TestEntity, testEntity1, testEntity2 } from '../tests.utils';
import { destructPk, getPkOfEntity } from '../pk.utils';
import { PkSchema } from '../../types/reducers.types';

describe('pkUtils', () => {
  describe('getPkOfEntity', () => {
    it('Should get PK of entity with only fields', () => {
      const testPkSchema: PkSchema<TestEntity, ['id', 'name'], []> = {
        fields: ['id', 'name'],
        edges: [],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      expect(entityPk).toBe(
        `${testEntity2.id}${testPkSchema.separator}${testEntity2.name}`,
      );
    });

    it('Should get PK of entity with only edges', () => {
      const testPkSchema: PkSchema<TestEntity, [], ['parent', 'sibling']> = {
        fields: [],
        edges: ['parent', 'sibling'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      expect(entityPk).toBe(
        `${testEntity2.__edges__.parent?.pks[0]}${testPkSchema.separator}${testEntity2.__edges__.sibling?.pks[0]}`,
      );
    });

    it('Should get PK of entity with fields and edges', () => {
      const testPkSchema: PkSchema<
        TestEntity,
        ['id', 'name'],
        ['parent', 'sibling']
      > = {
        fields: ['id', 'name'],
        edges: ['parent', 'sibling'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      expect(entityPk).toBe(
        `${testEntity2.id}${testPkSchema.separator}${testEntity2.name}${testPkSchema.separator}${testEntity2.__edges__.parent?.pks[0]}${testPkSchema.separator}${testEntity2.__edges__.sibling?.pks[0]}`,
      );
    });

    it('Should get PK of entity with fields and edges with multiple pks', () => {
      const testPkSchema: PkSchema<TestEntity, ['id', 'name'], ['children']> = {
        fields: ['id', 'name'],
        edges: ['children'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity1, testPkSchema);

      expect(entityPk).toBe(
        `${testEntity1.id}${testPkSchema.separator}${testEntity1.name}${testPkSchema.separator}${testEntity1.__edges__.children?.pks[0]}${testPkSchema.subSeparator}${testEntity1.__edges__.children?.pks[1]}`,
      );
    });
  });

  describe('destructPk', () => {
    it('Should destruct PK with only fields', () => {
      const testPkSchema: PkSchema<TestEntity, ['id', 'name'], []> = {
        fields: ['id', 'name'],
        edges: [],
        separator: '_',
        subSeparator: '-',
      };

      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      const destructedPk = destructPk(entityPk, testPkSchema);

      expect(destructedPk).toEqual({
        fields: {
          id: testEntity2.id,
          name: testEntity2.name,
        },
        edges: {},
      });
    });

    it('Should destruct PK with only edges', () => {
      const testPkSchema: PkSchema<TestEntity, [], ['parent', 'sibling']> = {
        fields: [],
        edges: ['parent', 'sibling'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      const destructedPk = destructPk<TestEntity, typeof testPkSchema>(
        entityPk,
        testPkSchema,
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
      const testPkSchema: PkSchema<
        TestEntity,
        ['id', 'name'],
        ['parent', 'sibling']
      > = {
        fields: ['id', 'name'],
        edges: ['parent', 'sibling'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      const destructedPk = destructPk<TestEntity, typeof testPkSchema>(
        entityPk,
        testPkSchema,
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
      const testPkSchema: PkSchema<TestEntity, ['id', 'name'], ['children']> = {
        fields: ['id', 'name'],
        edges: ['children'],
        separator: '_',
        subSeparator: '-',
      };
      const entityPk = getPkOfEntity(testEntity1, testPkSchema);

      const destructedPk = destructPk<TestEntity, typeof testPkSchema>(
        entityPk,
        testPkSchema,
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
});
