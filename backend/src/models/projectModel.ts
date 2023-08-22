import { Schema, model } from "mongoose";

const projectModel = new Schema({
  projectName: { type: String, required: true },
  language: { type: String, required: true },
  description: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});

export default model("project", projectModel);
