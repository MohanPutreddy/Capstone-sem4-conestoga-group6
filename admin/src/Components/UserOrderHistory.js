import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function UserOrderHistory() {
  const [orders, setOrders] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        `http://localhost:3000/cart/orders/user/${id}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const deleteReview = async (productid) => {
    try {
      const deleteResponse = await axios.delete(
        `http://localhost:3000/product/rating/${productid}/${id}`
      );
      if (deleteResponse.status) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleteing  Review:", error);
    }
  };

  return (
    <div className="ordersContainer">
      <h1>Your Orders</h1>
      <div>
        {orders?.map((order) => (
          <div className="order" key={order.orderid}>
            <div className="orderHeader">
              <p>Order Placed: {order.date}</p>
              <p>Total: CAD {order.total.toFixed(2)}</p>
              <p>Order # {order.orderid}</p>
            </div>
            {order.items.map((item) => (
              <div key={item.itemid} className="orderBody">
                <div className="orderBodyItemDetails">
                  <img
                    src={`http://localhost:3000/uploads/${item.image}`}
                    alt={item.bookname}
                    className="img-thumbnail"
                  />
                  <div>
                    <p>Book Name: {item.bookname}</p>
                    <p>Author Name: {item.authorname}</p>
                    <p>Price: CAD {item.price}</p>
                  </div>
                </div>

                <div className="orderBodyReviews">
                  {item.userRating && (
                    <>
                      <h6>Your Feedback</h6>
                      <p>Rating : {item.userRating?.rating || 0}</p>
                      <p>Review : {item.userRating?.review || ""}</p>
                      <button onClick={() => deleteReview(item.itemid)}>
                        Delete Review
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
