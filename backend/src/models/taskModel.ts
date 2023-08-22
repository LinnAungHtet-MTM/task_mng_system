import { Schema, model } from "mongoose";

const taskSchema = new Schema({
  project_name: { type: Schema.Types.ObjectId, required: true, ref: "project" },
  assigned_employee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "employee",
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimate_hour: { type: Number, required: true },
  actual_hour: { type: Number, required: true, default: 0 },
  status: { type: String, required: true, default: "0" },
  estimate_start_date: { type: String },
  estimate_finish_date: { type: String },
  actual_start_date: { type: String },
  actual_finish_date: { type: String },
});

export default model("task", taskSchema);
