import {Schema} from "mongoose";

export const GraphSchema = new Schema({
  type: String, // 'node' || 'link'
  name: String,
  label: String,
})
