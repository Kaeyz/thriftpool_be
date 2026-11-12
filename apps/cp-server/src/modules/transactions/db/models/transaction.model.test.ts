import { describe, expect, it } from "vitest";
import { Transaction } from "./transaction.model";

const transaction = {
  ref: "TXN-test",
  invoice: "507f1f77bcf86cd799439011",
  amount: 10,
  currencyCode: "NGN",
};
const proof = { fileId: "file-1", fileName: "proof.png", url: "https://example.com/proof.png" };

describe("transaction proof", () => {
  it("accepts a complete proof without adding a subdocument id", () => {
    const document = new Transaction({ ...transaction, proof });
    expect(document.validateSync()).toBeUndefined();
    expect(document.toObject().proof).toEqual(proof);
  });

  it("allows a transaction without proof", () => {
    expect(new Transaction(transaction).validateSync()).toBeUndefined();
  });

  it.each(["fileId", "fileName", "url"] as const)("requires %s when proof is present", (field) => {
    const document = new Transaction({ ...transaction, proof: { ...proof, [field]: undefined } });
    expect(Object.keys(document.validateSync()?.errors ?? {})).toContain(`proof.${field}`);
  });
});
