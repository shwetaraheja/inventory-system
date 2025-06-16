import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

function DeleteProduct() {
  const { role } = useContext(AuthContext);
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSearch = async () => {
    if (!barcode) {
      setMessage("Please enter a barcode.");
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}/products/${barcode.toLowerCase()}`
      );

      setProduct(res.data);
      setMessage("");
    } catch (err) {
      setProduct(null);
      setMessage("Product not found.");
    }
  };

  const handleDelete = async () => {
    if (!product) {
      setMessage("No product loaded to delete.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${BASE_URL}/products/${barcode.toLowerCase()}`);
        setMessage("Product deleted successfully.");
        setProduct(null);
        setBarcode("");
      } catch (error) {
        console.error("Error deleting product:", error);
        setMessage("Error deleting product.");
      }
    }
  };
  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all products?")) {
      try {
        await axios.delete(`${BASE_URL}/products`);
        setMessage("All products deleted successfully.");
        setProduct(null);
        setBarcode("");
      } catch (error) {
        console.error("Error deleting all products:", error);
        setMessage("Error deleting all products.");
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: "600px", marginTop: "40px" }}>
      <h2 className="mb-4" style={{ color: "#00336e", fontWeight: "700" }}>
        Delete Product
      </h2>
      {role !== "editor" ? (
        <div className="alert alert-danger">
          You are not authorized to delete products.
        </div>
      ) : (
        <>
          <div className="mb-3">
            {/* <button
              className=" attractive-button btn w-10"
              onClick={handleDeleteAll}
            >
              Delete All Products
            </button> */}
            <div className="input-group">
              <input
                id="barcodeInput"
                type="text"
                className="form-control"
                placeholder="Enter product barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
              <button
                className=" attractive-button ms-2"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          {product && (
            <div className="product-card">
              <div className="product-icon">📦</div>
              <h3>{product.name}</h3>
              <div className="product-detail-row">
                <span className="product-detail-label">Barcode:</span>
                <span>{product.barcode}</span>
              </div>
              <div className="product-detail-row">
                <span className="product-detail-label">Quantity:</span>
                <span>{product.quantity}</span>
              </div>
              <div className="product-detail-row">
                <span className="product-detail-label">Warehouse:</span>
                <span>{product.warehouse}</span>
              </div>
              <div className="product-detail-row">
                <span className="product-detail-label">aisle:</span>
                <span>{product.containerCode}</span>
              </div>
              <div className="text-end">
                <button
                  className=" attractive-button btn w-10"
                  onClick={handleDelete}
                >
                  🗑️ Delete Product
                </button>
              </div>
            </div>
          )}
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </>
      )}
    </div>
  );
}

export default DeleteProduct;
