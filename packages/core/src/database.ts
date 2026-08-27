import type { Types, Document } from "mongoose";
import { Schema } from "mongoose";
import type * as z from "zod";
import type { FieldDefinition } from "./db-fields";

export const transform = (v: Record<string, unknown>) => {
  if (!v || !v._id) return;
  v.id = String(v._id);
  delete v._id;
  return v;
};

export const addVirtualId = (schema: Schema) => {
  schema.virtual("id").get(function (this: { _id: Types.ObjectId }) {
    return this._id.toString();
  });

  const cleanID = (_doc: Document, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  };

  schema.set("toJSON", { virtuals: true, transform: cleanID });
  schema.set("toObject", { virtuals: true, transform: cleanID });
};

export const parseSelectFromSchema = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  const projection = {} as Record<keyof T, 1>;

  for (const key in schema.shape) {
    projection[key] = 1;
  }

  return projection;
};

export const createSubDocument = <T>(schema: FieldDefinition<T>): Schema<T> => {
  const subSchema = new Schema<T>(schema);
  addVirtualId(subSchema);
  return subSchema;
};

export type QueryOptions<T> = {
  populate?: T[];
};
