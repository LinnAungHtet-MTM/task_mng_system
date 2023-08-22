import { Schema, model } from "mongoose";

const notiSchema = new Schema({
  project: { type: String },
  title: { type: String, required: true },
  report_by: { type: String },
  profile: { type: String, required: true },
  unread: { type: String, default: true },
  userId: { type: String, required: true },
  reportToUserName: { type: String },
  // assignEmployeeId: { type: String },
  // taskCreated: { type: String },
  // status: { type: String, required: true },
});

export default model("notification", notiSchema);
