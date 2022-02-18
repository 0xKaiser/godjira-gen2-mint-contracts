import React, { useEffect, useState } from "react";

import "./App.css";
import Loader from "./components/loader/Loader";
import Main from "./mainComponent/Main";

function App() {
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, [2200]);
  }, []);
  return <>{showLoader ? <Loader /> : <Main />}</>;
}

export default App;
