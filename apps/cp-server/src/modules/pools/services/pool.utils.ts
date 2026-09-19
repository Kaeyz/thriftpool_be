import type { ISPool, ValidatePoolOptions } from "../common/pool.dto";
import type { PoolDoc } from "../db/pool.types";

export class PoolUtils {
  static sanitize(pool: PoolDoc): ISPool {
    const obj = pool.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISPool;
  }

  static validatePool(pool: PoolDoc | null, options: ValidatePoolOptions) {
    return pool;
  }
}
