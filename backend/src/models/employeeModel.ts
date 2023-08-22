import { Schema, model } from "mongoose";

const employeeSchema = new Schema({
  employeeName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  profile: { type: String },
  address: { type: String },
  phone: { type: String },
  DOB: { type: String },
  position: { type: String, required: true },
  token: { type: String },
  verified: { type: Boolean },
});

export default model("employee", employeeSchema);
