import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const Root = () => {
  const layoutContainer = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  return (
    <>
      <div style={layoutContainer}>
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default Root;
