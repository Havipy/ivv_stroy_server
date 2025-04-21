import { Schema, model } from "mongoose";

export interface BotUser {
  tgId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export const BotUserSchema = new Schema<BotUser>({
  tgId: { type: String, required: true },
  username: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const BotUser = model<BotUser>("BotUser", BotUserSchema);
