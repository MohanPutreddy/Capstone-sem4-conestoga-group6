import React, { createContext, useState } from "react";
import RootWrapper from "./RootWrapper";

export const AppContext = createContext(null);

export default function GlobalContextProvider() {
  const [logIn, setLogIn] = useState(false);
  return (
    <div>
      <AppContext.Provider value={{ logIn, setLogIn }}>
        <RootWrapper></RootWrapper>
      </AppContext.Provider>
    </div>
  );
}
