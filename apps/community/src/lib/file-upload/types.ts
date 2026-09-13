import type { MediaFile } from "@packages/core/types";
import type { Ctx } from "../ctx/ctx.types";

export type MimeType = "image/jpeg" | "image/png" | "application/pdf";

export interface UploadValidationRules {
  allowedMimeTypes?: MimeType[];
  maxSizeMB?: number;
  multiple?: boolean;
  maxFiles?: number;
}

export interface EntityDto<T> {
  entityName: string;
  entityDto: T;
  useCaseName: string;
}

export type UseCaseValidate = (ctx: Ctx, entityId: string) => Promise<{ status: boolean; message: string }>;

export interface UseCaseConfig<UseCaseName extends string, EntityDtoType> {
  useCaseName: UseCaseName;
  config?: UploadValidationRules;
  validate?: UseCaseValidate;
  resolve: (ctx: Ctx, entityId: string, data: MediaFile) => Promise<EntityDtoType>;
}

export interface EntityConfig<EntityNameType extends string, UseCaseName extends string, EntityDtoType extends object> {
  entityName: EntityNameType;
  useCases: UseCaseConfig<UseCaseName, EntityDtoType>[];
}

export type MulterFile = Express.Multer.File;

export interface IMediaUpload {
  file: MulterFile;
  name: string;
  entityName: string;
  entityId: string;
  useCase: string;
}

export interface IMediaPath {
  collection: string;
  name?: string;
}
