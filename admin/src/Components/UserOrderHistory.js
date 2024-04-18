import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const fetchAndDisplayImages = async (products, setDisplayProducts) => {
  const productImages = [];
  for (const product of products) {
    try {
      const response = await axios.get(`https://6811-99-251-82-105.ngrok-free.app/uploads/${product.image}`, {
        responseType: 'blob', // set the response type to blob
        headers: {
          'Content-Type': 'image/jpeg',
          'ngrok-skip-browser-warning': '69420'
        }
      });
      
      // Read the image data as a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = () => {
        const base64Image = reader.result;
        productImages.push({
          ...product,
          image: base64Image
        });
        setDisplayProducts([...productImages]); // update the display products state
      };
    } catch (error) {
      console.error("Error fetching image:", error);
      productImages.push(product);
      setDisplayProducts([...productImages]); // update the display products state
    }
  }
};

export default function UserOrderHistory() {
  const [orders, setOrders] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        `https://6811-99-251-82-105.ngrok-free.app/cart/orders/user/${id}`, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const deleteReview = async (productid) => {
    try {
      const deleteResponse = await axios.delete(
        `https://6811-99-251-82-105.ngrok-free.app/product/rating/${productid}/${id}`, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
      );
      if (deleteResponse.status) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting Review:", error);
    }
  };

  useEffect(() => {
    // Fetch and display images for each item in orders
    orders.forEach((order) => {
      fetchAndDisplayImages(order.items, (updatedItems) => {
        // Update the order items with base64 encoded images
        setOrders((prevOrders) => {
          return prevOrders.map((prevOrder) => {
            if (prevOrder.orderid === order.orderid) {
              return { ...prevOrder, items: updatedItems };
            }
            return prevOrder;
          });
        });
      });
    });
  }, [orders]);

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
                    src={item.image}
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
