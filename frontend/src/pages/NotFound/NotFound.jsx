import { useLocation, useRouteError } from "react-router-dom";
import { Result } from "antd";

const NotFound = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const error = useRouteError();
  const status = (error && error.status) || 404;
  const title =
    (error && error.message && error.data) ||
    `The request URL ${pathname} was not found on this server!`;

  return (
    <>
      <Result status={status} title={status} subTitle={title} />
    </>
  );
};

export default NotFound;
