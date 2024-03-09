import React, { createContext, useState } from "react";
import axios from "axios";
import RootWrapper from "./RootWrapper";

export const AppContext = createContext(null);

export default function GlobalContextProvider() {
  const [logIn, setLogIn] = useState(false);
  const [cartItems, setCartItems] = useState();
  const [fetchCount, refetch] = useState(1);

  React.useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/cart/`);
        setCartItems(response.data?.cart);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    if (logIn) fetchCartItems();
  }, [logIn, fetchCount]);
  return (
    <div>
      <AppContext.Provider
        value={{
          logIn,
          setLogIn,
          cartItems,
          setCartItems,
          reFetchCart: () => refetch((value) => value + 1),
        }}
      >
        <RootWrapper></RootWrapper>
      </AppContext.Provider>
    </div>
  );
}
