import { normalizeEntityArrayByPk } from '../normalizer.utils';
import {
  TestEntity,
  testEntity1,
  testEntity2,
  testEntity3,
  testPkSchema,
} from '../tests.utils';
import { getPkOfEntity } from '../pk.utils';

describe('normalizerUtils', () => {
  describe('normalizeEntityArrayByPk', () => {
    it('Should normalize entity array by PK', () => {
      const normalizedEntities = normalizeEntityArrayByPk<TestEntity>(
        testPkSchema,
        [testEntity1, testEntity2, testEntity3],
      );

      expect(normalizedEntities).toEqual({
        [getPkOfEntity(testEntity1, testPkSchema)]: testEntity1,
        [getPkOfEntity(testEntity2, testPkSchema)]: testEntity2,
        [getPkOfEntity(testEntity3, testPkSchema)]: testEntity3,
      });
    });
  });
});
