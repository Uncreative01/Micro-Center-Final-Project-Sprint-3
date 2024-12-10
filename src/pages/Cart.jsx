import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom"; // FOR NAVIGATION

export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]); // STORE PRODUCT DETAILS
  const [loading, setLoading] = useState(true); // LOADING STATE
  const [error, setError] = useState(false); // ERROR STATE

  const apiHost = "http://localhost:3000"; // API HOST

  // FUNCTION TO FETCH PRODUCT DETAILS BASED ON IDS
  useEffect(() => {
    const cart = Cookies.get("cart"); // GET THE CART FROM COOKIES
    if (cart) {
      const productIds = cart.split(","); // SPLIT CART ITEMS BY COMMA
      fetchProducts(productIds); // FETCH PRODUCT DETAILS USING PRODUCT IDS
    } else {
      setLoading(false); // IF NO PRODUCTS IN CART, STOP LOADING
    }
  }, []); // EMPTY DEPENDENCY ARRAY TO RUN ONCE AFTER INITIAL RENDER

  // FUNCTION TO FETCH PRODUCT DETAILS USING PRODUCT IDS
  const fetchProducts = async (productIds) => {
    try {
      // FETCH DETAILS FOR EACH UNIQUE PRODUCT ID
      const uniqueIds = [...new Set(productIds)]; // GET UNIQUE PRODUCT IDS
      const responses = await Promise.all(
        uniqueIds.map((id) => fetch(`${apiHost}/products/${id}`)) // FETCH PRODUCT DATA FROM API FOR EACH ID
      );
      const products = await Promise.all(responses.map((res) => res.json())); // PARSE THE RESPONSE JSON

      // ADD QUANTITY FOR EACH PRODUCT AND RETURN THE FULL PRODUCT DETAILS
      const productDetails = products.map((product) => {
        const quantity = productIds.filter((id) => id === product.product_id).length; // COUNT THE QUANTITY BASED ON THE PRODUCT ID
        return { ...product, quantity }; // RETURN PRODUCT DETAILS ALONG WITH QUANTITY
      });

      setCartProducts(productDetails); // UPDATE THE CART WITH PRODUCT DETAILS
    } catch (error) {
      console.error("Error fetching cart products:", error); // LOG ANY ERRORS THAT OCCUR DURING FETCHING
      setError(true); // SET ERROR STATE TO TRUE IF FETCHING FAILS
    } finally {
      setLoading(false); // STOP LOADING ONCE DATA IS FETCHED
    }
  };

  if (loading) return <p>Loading cart...</p>; // DISPLAY LOADING STATE WHILE FETCHING DATA
  if (error) return <p>Error fetching cart products</p>; // ERROR HANDLING IF FETCHING FAILS

  // CALCULATE THE SUBTOTAL COST
  const subtotal = cartProducts.reduce((acc, product) => acc + product.cost * product.quantity, 0); // CALCULATE TOTAL BASED ON PRICE AND QUANTITY

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1> {/* HEADER FOR THE CART PAGE */}
      <div className="cart-products">
        {cartProducts.length === 0 ? (
          <p>Your cart is empty. Start shopping!</p> // MESSAGE WHEN THE CART IS EMPTY
        ) : (
          cartProducts.map((product) => ( // MAP THROUGH CART PRODUCTS TO DISPLAY EACH ITEM
            <div key={product.product_id} className="cart-item">
              <img
                src={`http://localhost:3000/${product.image_filename}`}  // CORRECTED IMAGE PATH
                alt={product.name}  // ALT TEXT FOR THE IMAGE
                className="product-image" // CSS CLASS FOR THE IMAGE
              />
              <div className="cart-item-details">
                <h2>{product.name}</h2> {/* DISPLAY PRODUCT NAME */}
                <p>{`$${product.cost}`}</p> {/* DISPLAY PRODUCT COST */}
                <p>Quantity: {product.quantity}</p> {/* DISPLAY PRODUCT QUANTITY */}
                <p>Total: ${product.cost * product.quantity}</p> {/* CALCULATE TOTAL FOR EACH PRODUCT */}
              </div>
            </div>
          ))
        )}
      </div>

      {/* SUBTOTAL */}
      <div className="cart-subtotal">
        <h3>Subtotal: ${subtotal}</h3> {/* DISPLAY THE SUBTOTAL */}
      </div>

      {/* CART OPTIONS */}
      <div className="cart-actions">
        <Link to="/" className="btn btn-primary"> {/* LINK TO CONTINUE SHOPPING */}
          Continue Shopping
        </Link>
        <Link to="/checkout" className="btn btn-success"> {/* LINK TO COMPLETE PURCHASE */}
          Complete Purchase
        </Link>
      </div>
    </div>
  );
}
