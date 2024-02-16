import React, { useContext } from "react";

import { useEffect } from "react";
import Path from "./Path";
import { AppContext } from "./GlobalContextProvider";

export default function RootWrapper() {
  const { setLogIn } = useContext(AppContext);
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (authToken) {
      setLogIn(true);
    }
  }, [setLogIn]);

  return (
    <div>
      <Path></Path>
    </div>
  );
}
