import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import RootWrapper from "./RootWrapper";

export const AppContext = createContext(null);

export default function GlobalContextProvider() {
  const [logIn, setLogIn] = useState(false);
  const [cartItems, setCartItems] = useState();
  const [userId, setUserId] = useState();
  const [fetchCount, refetch] = useState(1);

  const [Profile, setProfile] = useState("");

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_NGROK_URL}/userauth/profile`, {
            headers: {
              'ngrok-skip-browser-warning': '69420'
            }
          }
        );
        setProfile(response.data?.profile);
        setUserId(response.data.profile.id);
      } catch (error) {
        console.error("error while getting details:", error);
      }
    };
    if (logIn) fetchProfileDetails();
  }, [logIn, userId, fetchCount]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_NGROK_URL}/cart/`, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        });
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
          userId,
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
