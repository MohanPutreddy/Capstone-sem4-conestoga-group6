import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AppContext } from "./GlobalContextProvider";

export default function PaymentSuccess() {
  const [data, setData] = useState(null);
  const { reFetchCart } = useContext(AppContext);
  const flag = useRef(false);

  useEffect(() => {
    if (flag.current) {
      return;
    }
    flag.current = true;
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.post(
        "http://localhost:3000/cart/placeorder"
      );
      setData(response.data);
      if (response.status) {
        reFetchCart();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  return (
    <div>
      <h1>Payment Success</h1>
      <h6>Transaction id :{data?.orderDetails?.paymentid}</h6>
    </div>
  );
}
