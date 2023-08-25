import { Schema, model } from "mongoose";

const employeeSchema = new Schema({
  EmployeeName: { type: String },
  createdBy: { type: String, required: true },
  userId: { type: String, required: true },
  profile: { type: String, required: true },
  status: { type: String, required: true },
  type: { type: String, required: true },
  project: { type: String },
  read: { type: Array, default: [] },
});

export default model("employeeNoti", employeeSchema);
