import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import RootWrapper from "./RootWrapper";

export const AppContext = createContext(null);

export default function GlobalContextProvider() {
  const [logIn, setLogIn] = useState(false);
  const [cartItems, setCartItems] = useState();
  const [fetchCount, refetch] = useState(1);

  const [Profile, setProfile] = useState("");

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/userauth/profile`
        );
        setProfile(response.data?.profile);
      } catch (error) {
        console.error("error while getting details:", error);
      }
    };
    if (logIn) fetchProfileDetails();
  }, [logIn, fetchCount]);

  useEffect(() => {
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
          setProfile,
          Profile,
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
