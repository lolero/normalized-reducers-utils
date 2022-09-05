import { normalizeEntityArrayByPk } from './normalizer.utils';
import {
  testEntity1,
  testEntity2,
  testEntity3,
  testPkSchema,
  getPkOfTestEntity,
} from './spec.utils';

describe('normalizer.utils', () => {
  describe('normalizeEntityArrayByPk', () => {
    it('Should normalize entity array by PK', () => {
      const normalizedEntities = normalizeEntityArrayByPk(testPkSchema, [
        testEntity1,
        testEntity2,
        testEntity3,
      ]);

      expect(normalizedEntities).toEqual({
        [getPkOfTestEntity(testEntity1)]: testEntity1,
        [getPkOfTestEntity(testEntity2)]: testEntity2,
        [getPkOfTestEntity(testEntity3)]: testEntity3,
      });
    });
  });
});
