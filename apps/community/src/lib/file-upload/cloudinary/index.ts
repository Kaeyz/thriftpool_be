import type { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import type { MediaFile } from "../../definitions/types";
import type { Ctx } from "../../request-context/config";
import type { IMediaUpload } from "../types";
import { getKeys } from "@/config/keys";

const keys = getKeys();
cloudinary.config(keys.cloudinaryKeys);

const uploadBuffer = (buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse | UploadApiErrorResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      if (result) return resolve(result);
    });
    stream.end(buffer);
  });
};

type Res = { status: "success"; data: MediaFile } | { status: "failed"; data: UploadApiErrorResponse | null };
export class CloudinaryService {
  static async upload(ctx: Ctx, fileData: IMediaUpload): Promise<Res> {
    const response: Res = { status: "failed", data: null };
    const env = getKeys().appEnv.toLowerCase() === "prod" ? "prod" : "staging";

    const collection = `${fileData.entityName}/${fileData.useCase}`;
    const folder = `thriftpool/${env}/${collection}`;

    const uploadOptions: UploadApiOptions = {
      folder,
      public_id: fileData.entityId,
      resource_type: "auto",
    };

    const uploadRes = await uploadBuffer(fileData.file.buffer, uploadOptions).catch(
      (err: UploadApiErrorResponse) => (response.data = err)
    );
    if (response.data) return response;

    return {
      status: "success",
      data: {
        fileId: uploadRes.public_id,
        fileName: fileData.file.originalname,
        url: uploadRes.secure_url,
      },
    };
  }
}
