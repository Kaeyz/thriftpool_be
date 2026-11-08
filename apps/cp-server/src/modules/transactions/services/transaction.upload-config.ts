import type { ISTransaction } from "../common/transaction.dto";
import { TransactionService } from "./transaction.service";
import type { EntityConfig } from "@/lib/file-upload";

export const transactionUploadConfig: EntityConfig<string, string, ISTransaction> = {
  entityName: "transaction",
  useCases: [
    {
      useCaseName: "proof",
      config: {
        allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf"],
        maxSizeMB: 5,
      },
      validate: (ctx, transactionId) => TransactionService.validateProofUpload(ctx, transactionId),
      resolve: async (ctx, transactionId, mediaFile) => {
        const { data } = await TransactionService.submitTransactionProof(ctx, transactionId, mediaFile);
        return data;
      },
    },
  ],
};
