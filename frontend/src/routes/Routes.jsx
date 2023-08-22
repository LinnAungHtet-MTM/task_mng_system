import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import ForgetPassword from "../pages/ForgetPassword/ForgetPassword";
import ProjectCommon from "../pages/ProjectCommon/ProjectCommon";
import ProjectList from "../pages/ProjectList/ProjectList";
import TaskList from "../pages/TaskList/TaskList";
import CommonTask from "../pages/CommonTask/CommonTask";
import ReportList from "../pages/ReportList/ReportList";
import CreateReport from "../pages/CreateReport/CreateReport";
import Dashboard from "../pages/Dashboard/Dashboard";
import Root from "../components/Layout/Root";
import EmployeeList from "../pages/EmployeeList/EmployeeList";
import EmployeeCommon from "../pages/EmployeeCommon/EmployeeCommon";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import NotFound from "../pages/NotFound/NotFound";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import VerifyAccount from "../pages/VerifyAccount/VerifyAccount";
import AuthRoute from "./AuthRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        element: <AuthRoute />,
        errorElement: <NotFound />,
        children: [
          {
            path: "",
            element: <Login />,
          },
        ],
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "reset-password/:id",
        element: <ResetPassword />,
      },
      {
        path: "verify",
        element: <VerifyAccount />,
      },
      {
        element: <PrivateRoute />,
        errorElement: <NotFound />,
        children: [
          {
            element: <AdminRoute />,
            errorElement: <NotFound />,
            children: [
              {
                path: "employee/list",
                element: <EmployeeList />,
                errorElement: <NotFound />,
              },
              {
                path: "employee/add",
                element: <EmployeeCommon />,
                errorElement: <NotFound />,
              },
              {
                path: "employee/detail/:id",
                element: <EmployeeCommon />,
                errorElement: <NotFound />,
              },
              {
                path: "employee/edit/:id",
                element: <EmployeeCommon />,
                errorElement: <NotFound />,
              },
              {
                path: "project/list",
                element: <ProjectList />,
                errorElement: <NotFound />,
              },
              {
                path: "project/add",
                element: <ProjectCommon />,
                errorElement: <NotFound />,
              },
              {
                path: "project/edit/:id",
                element: <ProjectCommon />,
                errorElement: <NotFound />,
              },
            ],
          },
          {
            path: "change-password",
            element: <ChangePassword />,
            errorElement: <NotFound />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
            errorElement: <NotFound />,
          },
          {
            path: "profile",
            element: <EmployeeCommon />,
            errorElement: <NotFound />,
          },
          {
            path: "task/list",
            element: <TaskList />,
            errorElement: <NotFound />,
          },
          {
            path: "task/add",
            element: <CommonTask />,
            errorElement: <NotFound />,
          },
          {
            path: "task/edit/:id",
            element: <CommonTask />,
          },
          {
            path: "report/list",
            element: <ReportList />,
          },
          {
            path: "report/add",
            element: <CreateReport />,
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

export default router;
