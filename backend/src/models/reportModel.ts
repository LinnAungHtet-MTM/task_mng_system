import dayjs from "dayjs";
import { Schema, model } from "mongoose";

const reportSchema = new Schema({
  task_id: { type: Schema.Types.ObjectId, required: true, ref: "task" },
  percentage: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  hr: { type: Number, required: true },
  problem: { type: String },
  report_to: { type: String },
  report_by: { type: String },
  created_at: { type: Date, default: dayjs() },
});

export default model("report", reportSchema);
