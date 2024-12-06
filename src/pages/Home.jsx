import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";  // Assuming the Home.css is in the ui folder

function Home() {
  const [products, setProducts] = useState([]);

  // Fetch the products from the backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:3000/products/all");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <h1>Our Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.product_id} className="product-item">
            {/* Wrap the product item in a Link to navigate to the Details page */}
            <Link to={`/details/${product.product_id}`} className="product-link">
              <img
                src={`http://localhost:3000/${product.image_filename}`}  // Corrected image path
                alt={product.name}  // Alt text for the image
                className="product-image"
              />
              <h2>{product.name}</h2>
              <p>{product.description}</p>  {/* Display the description */}
              <p>{`$${product.cost}`}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
