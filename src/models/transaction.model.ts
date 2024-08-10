import mongoose, { Schema, Document, Model } from "mongoose";
import { ITransaction } from "../interfaces";

const TransactionSchema = new Schema(
 {
  customer: String,
  vendorId: String,
  orderId: String,
  orderValue: Number,
  offerUsed: String,
  status: String,
  paymentMode: String,
  paymentResponse: String,
 },
 {
  toJSON: {
   transform(doc, ret) {
    delete ret.__v;
   },
  },
  timestamps: true,
 }
);

const Transaction = mongoose.model<ITransaction>("transaction", TransactionSchema);

export { Transaction };
