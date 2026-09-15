import type { MediaFile } from "@packages/core/types";
import type { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import type { IMediaUpload } from "../types";
import { getKeys } from "@/config/keys";

const keys = getKeys();
cloudinary.config(keys.cloudinaryKeys);

const uploadBuffer = (buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse | UploadApiErrorResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
};

type Res = { status: "success"; data: MediaFile } | { status: "failed"; data: UploadApiErrorResponse };
export class CloudinaryService {
  static async upload(fileData: IMediaUpload): Promise<Res> {
    const env = getKeys().appEnv.toLowerCase() === "prod" ? "prod" : "staging";

    const collection = `${fileData.entityName}/${fileData.useCase}`;
    const folder = `nehemax/${env}/${collection}`;

    const uploadOptions: UploadApiOptions = {
      folder,
      public_id: fileData.entityId,
      resource_type: "auto",
    };

    try {
      const uploadRes = await uploadBuffer(fileData.file.buffer, uploadOptions);

      return {
        status: "success",
        data: {
          fileId: uploadRes.public_id,
          fileName: fileData.file.originalname,
          url: uploadRes.secure_url,
        },
      };
    } catch (err) {
      return {
        status: "failed",
        data: err as UploadApiErrorResponse,
      };
    }
  }
}
