import { Schema, model } from "mongoose";

const taskNotiSchema = new Schema({
  title: { type: String, required: true },
  assignEmployeeId: { type: String, required: true },
  profile: { type: String, required: true },
  unread: { type: String, default: true },
  userId: { type: String, required: true },
  status: { type: String, default: "task" },
  taskCreated: { type: String, required: true },
});

export default model("taskNotification", taskNotiSchema);
