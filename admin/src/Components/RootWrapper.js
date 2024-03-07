import React, { useContext } from "react";

import { useEffect } from "react";

import { AppContext } from "./GlobalContextProvider";
import Paths from "./Paths";

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
      <Paths></Paths>
    </div>
  );
}
