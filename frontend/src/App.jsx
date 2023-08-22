import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { appContext } from "./constants/appContext";
import { verifyContext } from "./constants/appContext";
import router from "./routes/Routes";

const App = () => {
  const [currentMenuItem, setCurrentMenuItem] = useState("");
  const [verifyPage, setVerifyPage] = useState(false);

  return (
    <appContext.Provider value={{ currentMenuItem, setCurrentMenuItem }}>
      <verifyContext.Provider value={{ verifyPage, setVerifyPage }}>
        <RouterProvider router={router} />
      </verifyContext.Provider>
    </appContext.Provider>
  );
};

export default App;
