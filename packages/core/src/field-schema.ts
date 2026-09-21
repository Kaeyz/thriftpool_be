import mongoose, { Types } from "mongoose";
import * as z from "zod";
import { currencyCodes } from "./currencies";
import type { CurrencyCode } from "./enums";
import { transformIds } from "./validation";

type TextFieldOptions = {
  max?: number;
};

export class FieldSchemas {
  static emailSchema(fieldName: string = "Email Address") {
    return z.email({ error: `${fieldName} is required or invalid` });
  }

  static booleanSchema(fieldName: string = "Boolean Field") {
    return z.boolean({ error: `${fieldName} is required or invalid` });
  }

  static numberSchema(fieldName: string = "Number") {
    return z.number({ error: `${fieldName} is required or invalid` });
  }

  static enumSelectSchema<T extends z.ZodEnum<Record<string, string>>>(fieldName: string, schema: T): T {
    const options = schema.options;
    const list = options.join(", ");

    return schema.refine((val) => options.includes(val), {
      message: `${fieldName} is required or invalid. Must be one of: ${list}`,
    }) as T;
  }

  static numberStringSchema(fieldName: string = "Number", options?: { max?: number; min?: number }) {
    let schema = z.string({ error: `${fieldName} is required` }).regex(/^\d+$/, {
      error: `${fieldName} must contain only numbers`,
    });

    if (options) {
      const { min, max } = options;
      if (min !== undefined) {
        schema = schema.min(min, {
          error: `${fieldName} must be at least ${min} digits long`,
        });
      }
      if (max !== undefined) {
        schema = schema.max(max, {
          error: `${fieldName} must be at most ${max} digits long`,
        });
      }
    }

    return schema;
  }

  static passwordSchema(fieldName: string = "Password") {
    return z
      .string({ error: `${fieldName} is required` })
      .min(8, { error: `${fieldName} must be at least 8 characters long` })
      .regex(/[A-Z]/, { error: `${fieldName} must contain at least one uppercase letter` })
      .regex(/[a-z]/, { error: `${fieldName} must contain at least one lowercase letter` })
      .regex(/[0-9]/, { error: `${fieldName} must contain at least one number` })
      .regex(/[^A-Za-z0-9]/, { error: `${fieldName} must contain at least one special character` });
  }

  static tokenSchema(fieldName: string = "Token") {
    return z.string({ error: `${fieldName} is required` }).max(6, { error: `${fieldName} must be 6 characters long` });
  }

  static nameSchema(fieldName: string = "Name") {
    return z
      .string({ error: `${fieldName} is required` })
      .max(15, { error: `${fieldName} must be less than 15 characters long` });
  }

  static dbIdSchema(fieldName: string = "ID") {
    return z
      .string({ error: `${fieldName} is required` })
      .refine((val) => mongoose.Types.ObjectId.isValid(val), { error: `Invalid ${fieldName}` });
  }

  static textSchema(fieldName: string, options: TextFieldOptions = {}) {
    const max = options?.max || 90;
    return z
      .string({ error: `${fieldName} is required` })
      .max(max, { error: `${fieldName} must be less than ${max} characters long` });
  }

  static fileSchema(fieldName: string = "File") {
    return z.object(
      {
        fieldname: z.string(),
        originalname: z.string({ error: "originalname is required" }),
        encoding: z.string(),
        mimetype: z.string({ error: "mimetype is required" }),
        size: z.number({ error: "size is required" }),
        buffer: z.any().refine((val) => val !== undefined && val !== null, { message: "File buffer is required" }),
      },
      { error: `${fieldName} is required` }
    );
  }

  static phoneNumberSchema(fieldName: string = "Phone Number") {
    return z.object(
      {
        countryCode: z.string({ error: "Country Code is required" }).regex(/^\+\d+$/, "Invalid country code"),
        number: z.string({ error: "Number is required" }).regex(/^\d{4,15}$/, "Invalid phone number"),
      },
      { error: `${fieldName} is required` }
    );
  }

  static addressSchema(fieldName: string = "File") {
    return z.object(
      {
        country: z.string({ error: "country is required" }),
        state: z.string({ error: "state is required" }),
        city: z.string({ error: "city is required" }),
        zipCode: z.string({ error: "zipCode is required" }),
        address: z.string({ error: "address is required" }),
      },
      { error: `${fieldName} is required` }
    );
  }

  static dateSchema(fieldName: string = "Date") {
    return z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        error: `${fieldName} must be in YYYY-MM-DD format`,
      })
      .refine((value) => {
        const [year, month, day] = value.split("-").map(Number);
        const d = new Date(year, month - 1, day);
        return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
      }, `${fieldName} is invalid`);
  }

  static dbIdsSchema(fieldName: string = "ids") {
    return z
      .union([z.array(z.string()), z.string({ error: `${fieldName} is required` })])
      .refine((ids) => transformIds(ids).every((id) => Types.ObjectId.isValid(id)), {
        message: `One or more ${fieldName} are invalid ObjectIds`,
      });
  }

  static currencyCodeSchema(fieldName: string = "Currency Code") {
    const list = currencyCodes.join(", ");

    return z.string({ error: `${fieldName} is required` }).refine((val) => currencyCodes.includes(val as CurrencyCode), {
      message: `${fieldName} is required or invalid. Must be one of: ${list}`,
    });
  }
}
