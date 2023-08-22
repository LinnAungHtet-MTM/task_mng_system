export const commonConstants = {
  //  Authentication
  Password_Regex: /^.{8,}$/,
  Require_Email: "Please enter your email",
  Require_Password: "Please enter your password",
  Validate_Email: "Invalid email address",
  Validate_Password: "Password must at least 8 characters",
  Validate_OldPassword: "Please enter old password",
  Validate_NewPassword: "Please enter new password",
  Validate_ConfirmPassword: "Please enter confirm password",
  Check_ConfirmPassword: "New password and confirm password must same",
  Check_OldPassword: "Old password and new password must not same",

  //     Employee Page
  Require_Employee_Name: "Employee name is required",
  Require_Employee_Email: "Employee email is required",
  Employee_Exist: "Employee email already exists",
  Network_Err: "Network Error",
  Employee_Not_Exist:
    "Tasks have been assigned to this user that cannot be deleted.",
  Employee_Create:
    "Employee created successfully! please check your email and verify your account.",

  //   Project Page
  Require_Project_Name: "Project name is required",
  Require_Project_Language: "Project language is required",
  Require_Project_StartDate: "Project start date is required",
  Require_Project_EndDate: "Project end date is required",
  Project_Not_Exist: "Tasks assigned to a project cannot be deleted.",

  //  Task Page
  Validate_Hour: "only number is allowed",
  Date_Validate: "End date cannot be less than start date",
  Require_Task_Project: "Project is required",
  Require_Task_Title: "Task title is required",
  Require_Task_Status: "Task Status is required",
  Require_Task_description: "Task description is required",
  Require_Task_employee: "Assigned employee is required",
  Require_estimate_hr: "Estimate hour is required",
  Require_actual_hr: "Actual hour is required",

  //   Report Page
  Report_Success: "Report Created Successed",
  Report_Fail: "Report Created Failed",
  Validate_TotalHr: "Total hour cannot be greater than 8 hours!",
  TotalHr_fill: "Plz fill total hour to 8 hours!",
  Require_Task: "Please select task",
  Require_Percentage: "Please add percentage",
  Validate_Min_Percentage: "Percentage cannot be less than 0",
  Validate_Max_Percentage: "Percentage cannot greater than 100",
  Require_Type: "Please select type",
  Require_Status: "Please select status",
  Require_Hour: "Please select hour",
  Validate_Min_Hr: "Total hours cannot be less than 0",
  Hour_Regex: /^[0-9]+$/,
  Report_created_fail: "Report created Failed",
  Report_created_success: "Report created Success",
};
