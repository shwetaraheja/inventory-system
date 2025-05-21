import React, { useState } from 'react';
import axios from 'axios';

function InventoryFinder() {
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!barcode || barcode.length < 2) {
      setError("Please enter at least 2 characters.");
      setProduct(null);
      return;
    }

    try {
      // Query the backend endpoint
      const res = await axios.get(`http://localhost:5004/products/find?barcode=${barcode.toLowerCase()}`);
      const data = Array.isArray(res.data) ? res.data : [];
      
      if (data.length >= 1) {
        // If one or more matching products are found, we'll just show the first one.
        setProduct(data[0]);
        setError('');
      } else {
        setProduct(null);
        setError('No product found.');
      }
    } catch (err) {
      console.error("Search error:", err);
      setProduct(null);
      setError("Error searching for product.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
      <h2 className="mb-4" style={{ color: '#00336e', fontWeight: '700' }}>Find Product by Barcode</h2>
      
      <div className="input-group mb-3">
        <input 
          type="text" 
          className="form-control"
          placeholder="Enter barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <button className="attractive-button ms-2" style={{ minWidth: '100px' }} onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {product && (
        <div className="product-card">
          <div className="product-icon">📦</div>
          <h3>{product.name.charAt(0).toUpperCase() + product.name.slice(1)}</h3>
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
            <span>{product.warehouse.toUpperCase()}</span>
          </div>
          <div className="product-detail-row">
            <span className="product-detail-label">aisle:</span>
            <span>{product.containerCode}</span>
          </div>
        </div>)}
    </div>
    
  );
}

export default InventoryFinder;
