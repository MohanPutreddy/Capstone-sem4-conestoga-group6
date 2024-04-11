import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get("http://localhost:3000/cart/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

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
      // Send review and rating data to the server
      const response = await axios.post(
        "http://localhost:3000/product/rating",
        {
          productid: productId,
          rating: rating,
          review: review,
        }
      );
      if (response.data.status) {
        setReview("");
        setRating(0);
        fetchData();
      }
      // Handle success or display any message to the user
      console.log(response.data); // Log the response from the server
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/cart/download-invoice",
        { orderId },
        { responseType: "blob" } // Specify response type as blob to download file
      );

      // Create a blob URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
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
              <p>Total: CAD {(order.total).toFixed(2)}</p>
              <p>Order # {order.orderid}</p>
              <button className="btn btn-dark" onClick={() => downloadInvoice(order.orderid)}>
                Download Invoice
              </button>
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
                        {/* Button to submit review and rating */}
                        <button className="btn btn-primary width100"
                          onClick={() => submitReview(item.itemid, rating, review)}
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
