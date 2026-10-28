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

type SerializationHook = (_doc: Document, ret: Record<string, unknown>) => void;

export const addVirtualId = (schema: Schema, serialize?: SerializationHook) => {
  schema.virtual("id").get(function (this: { _id: Types.ObjectId }) {
    return this._id.toString();
  });

  const cleanID = (_doc: Document, ret: Record<string, unknown>) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;

    serialize?.(_doc, ret);
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

export const isPathSelected = (projection: object | null | undefined, path: string) => {
  if (!projection) return true;

  const entries = Object.entries(projection);
  const isInclusive = entries.some(([key, selected]) => key !== "_id" && selected === 1);

  if (isInclusive) {
    return entries.some(
      ([key, selected]) => selected === 1 && (key === path || key.startsWith(`${path}.`) || path.startsWith(`${key}.`))
    );
  }

  const excludedPath = entries.find(([key]) => key === path || path.startsWith(`${key}.`));
  return excludedPath?.[1] !== 0;
};

export const createSubDocument = <T>(schema: FieldDefinition<T>): Schema<T> => {
  const subSchema = new Schema<T>(schema);
  addVirtualId(subSchema);
  return subSchema;
};

export type QueryOptions<T> = {
  populate?: T[];
};
