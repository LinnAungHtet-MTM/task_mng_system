import { Layout } from "antd";
import "./Footer.css";

const Footer = () => {
  const { Footer } = Layout;

  return (
    <Footer className="footer-container">
      <p className="footer-text">
        <span>TASK MANAGEMENT SYSTEM</span>
        <span style={{ textAlign: "end" }}>Copyright &copy; 2023</span>
      </p>
    </Footer>
  );
};

export default Footer;
