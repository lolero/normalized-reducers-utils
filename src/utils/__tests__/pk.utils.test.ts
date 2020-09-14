import { TestEntity, testEntity2 } from '../tests.utils';
import { destructPk, getPkOfEntity } from '../pk.utils';
import { PkSchema } from '../../types/reducers.types';

describe('pkUtils', () => {
  describe('getPkOfEntity', () => {
    it('Should get PK of entity with only fields', () => {
      const testPkSchema: PkSchema<TestEntity> = {
        fields: ['id', 'name'],
        edges: [],
        separator: '___',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      expect(entityPk).toBe(
        `${testEntity2.id}${testPkSchema.separator}${testEntity2.name}`,
      );
    });

    it('Should get PK of entity with only edges', () => {
      const testPkSchema: PkSchema<TestEntity> = {
        fields: [],
        edges: ['parent', 'sibling'],
        separator: '___',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      expect(entityPk).toBe(
        `${testEntity2.__edges__.parent?.pks[0]}${testPkSchema.separator}${testEntity2.__edges__.sibling?.pks[0]}`,
      );
    });

    it('Should get PK of entity with fields and edges', () => {
      const testPkSchema: PkSchema<TestEntity> = {
        fields: ['id', 'name'],
        edges: ['parent', 'sibling'],
        separator: '___',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      expect(entityPk).toBe(
        `${testEntity2.id}${testPkSchema.separator}${testEntity2.name}${testPkSchema.separator}${testEntity2.__edges__.parent?.pks[0]}${testPkSchema.separator}${testEntity2.__edges__.sibling?.pks[0]}`,
      );
    });
  });

  describe('destructPk', () => {
    it('Should destruct PK with only fields', () => {
      const testPkSchema: PkSchema<TestEntity> = {
        fields: ['id', 'name'],
        edges: [],
        separator: '___',
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
      const testPkSchema: PkSchema<TestEntity> = {
        fields: [],
        edges: ['parent', 'sibling'],
        separator: '___',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      const destructedPk = destructPk(entityPk, testPkSchema);

      expect(destructedPk).toEqual({
        fields: {},
        edges: {
          parent: testEntity2.__edges__.parent?.pks[0],
          sibling: testEntity2.__edges__.sibling?.pks[0],
        },
      });
    });

    it('Should destruct PK with fields and edges', () => {
      const testPkSchema: PkSchema<TestEntity> = {
        fields: ['id', 'name'],
        edges: ['parent', 'sibling'],
        separator: '___',
      };
      const entityPk = getPkOfEntity(testEntity2, testPkSchema);

      const destructedPk = destructPk(entityPk, testPkSchema);

      expect(destructedPk).toEqual({
        fields: {
          id: testEntity2.id,
          name: testEntity2.name,
        },
        edges: {
          parent: testEntity2.__edges__.parent?.pks[0],
          sibling: testEntity2.__edges__.sibling?.pks[0],
        },
      });
    });
  });
});
