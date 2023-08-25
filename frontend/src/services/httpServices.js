import { create } from "./apiService";

export const project = create("/project");

export const employee = create("/employee");

export const task = create("/task");

export const report = create("/report");

export const noti = create("/notification");

export const taskNoti = create("/taskNoti");

export const EmployeeNoti = create("/EmployeeNoti");
