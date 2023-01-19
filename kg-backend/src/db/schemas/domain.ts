import { Schema } from "mongoose";

export const DomainSchma = new Schema({
  name: String,
  description: String,
  createAt: Date,
  updateAt: Date,
  graphName: String,
})
