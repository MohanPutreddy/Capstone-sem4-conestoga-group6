import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "./GlobalContextProvider";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const { userId } = useContext(AppContext);

  useEffect(() => {
    userId && fetchData();
  }, [userId]);

  async function fetchData() {
    try {
      const response = await axios.get(
        `https://6811-99-251-82-105.ngrok-free.app/cart/orders/user/${userId}`,
        {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
      );

      const ordersWithImages = await Promise.all(response.data.map(async (order) => {
        const itemsWithImages = await fetchAndDisplayImages(order.items);
        order.items = itemsWithImages;
        return order;
      }));

      setOrders(ordersWithImages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const fetchAndDisplayImages = async (items) => {
    try {
      const updatedItems = await Promise.all(items.map(async (item) => {
        const response = await axios.get(`https://6811-99-251-82-105.ngrok-free.app/uploads/${item.image}`, {
          responseType: 'blob', // set the response type to blob
          headers: {
            'Content-Type': 'image/jpeg',
            'ngrok-skip-browser-warning': '69420'
          }
        });
        
        const imageUrl = URL.createObjectURL(response.data);
        return { ...item, image: imageUrl };
      }));
      
      return updatedItems;
    } catch (error) {
      console.error("Error fetching image:", error);
      return items; // Return the original items in case of error
    }
  };  

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleRatingChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 5) {
      setRating(value);
    }
  };

  const submitReview = async (productId, rating, review) => {
    try {
      const response = await axios.post(
        "https://6811-99-251-82-105.ngrok-free.app/product/rating",
        {
          productid: productId,
          rating: rating,
          review: review,
        }, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
      );
      if (response.data.status) {
        setReview("");
        setRating(0);
        fetchData();
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await axios.post(
        "https://6811-99-251-82-105.ngrok-free.app/cart/download-invoice",
        { orderId },
        { responseType: "blob" }, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading invoice:", error);
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
              <button className="btn btn-dark" onClick={() => downloadInvoice(order.orderid)}>
                Download Invoice
              </button>
            </div>
            {order.items.map((item) => (
              <div key={item.itemid} className="orderBody">
                <div className="orderBodyItemDetails">
                  <img
                    src={item.image}
                    alt={item.bookname}
                    className="img-thumbnail"
                  />
                  <div>
                    <p>Book Name: {item.bookname}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: CAD {item.price}</p>
                  </div>
                </div>

                <div className="orderBodyReviews">
                  {item.userRating && (
                    <>
                      <h6>Your Feedback</h6>
                      <p>Rating : {item.userRating?.rating || 0}</p>
                      <p>Review : {item.userRating?.review || ""}</p>
                    </>
                  )}
                  {!item.userRating && (
                    <>
                      <textarea
                        className="form-control"
                        value={review}
                        onChange={handleReviewChange}
                        placeholder="Add your review"
                      />
                      <div>
                        <input
                          className="form-control"
                          type="number"
                          value={rating}
                          onChange={handleRatingChange}
                          placeholder="Rating (0-5)"
                        />
                        <button
                          className="btn btn-primary width100"
                          onClick={() =>
                            submitReview(item.itemid, rating, review)
                          }
                        >
                          Add Rating
                        </button>
                      </div>
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
