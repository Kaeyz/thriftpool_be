import { MinistryDoc } from "../db/ministry.types";
import { ISMinistry } from "./ministry.dto";

export class MinistryUtils {
  static sanitize(ministry: MinistryDoc): ISMinistry {
    const obj = ministry.toJSON();
    delete obj.updatedAt;
    return obj as unknown as ISMinistry;
  }
}
