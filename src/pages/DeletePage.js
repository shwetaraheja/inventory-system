
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function DeleteProduct() {
  const { role } = useContext(AuthContext);
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!barcode) {
      setMessage('Please enter a barcode.');
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5004/products/${barcode.toLowerCase()}`);
      setProduct(res.data);
      setMessage('');
    } catch (err) {
      setProduct(null);
      setMessage('Product not found.');
    }
  };

  const handleDelete = async () => {
    if (!product) {
      setMessage('No product loaded to delete.');
      return;
    }
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5004/products/${barcode.toLowerCase()}`);
        setMessage('Product deleted successfully.');
        setProduct(null);
        setBarcode('');
        
      } catch (error) {
        console.error("Error deleting product:", error);
        setMessage('Error deleting product.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Delete Product</h2>
      {role !== 'editor' ? (
        <div className="alert alert-danger">
          You are not authorized to delete products.
        </div>
      ) : (
          <>
            
          <div className="mb-3">
            <label htmlFor="barcodeInput" className="form-label">Enter Barcode:</label>
            <div className="input-group">
              <input
                id="barcodeInput"
                type="text"
                className="form-control"
                placeholder="Enter product barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
              <button className=" attractive-button btn w-10" onClick={handleSearch}>
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
                <button className=" attractive-button btn w-10" onClick={handleDelete}>
                  🗑️ Delete Product
                </button>
              </div>
             </div>
      )}

          {message && (
            <div className="alert alert-info mt-3">
              {message}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DeleteProduct;
