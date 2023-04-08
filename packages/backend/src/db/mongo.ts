import mongoose, { connect, Schema, model } from "mongoose";

mongoose.set("strictQuery", false);

export const mongoInitial = async () => {
  await connect("mongodb://127.0.0.1:27017", {
    dbName: "graph",
    user: "root",
    pass: "example",
  });
};

const graphSchema = new Schema({
  name: String,
  groups: [String],
});

export const Graph = model("graph", graphSchema);
