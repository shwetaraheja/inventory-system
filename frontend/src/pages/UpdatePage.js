import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdatePage() {
  const { barcode } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputBarcode, setInputBarcode] = useState(barcode || '');

  // Fetch product details by barcode
  useEffect(() => {
    const fetchProduct = async () => {
      if (!barcode) return;
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5004/products/${barcode.toLowerCase()}`);
        setProduct(res.data);
        setMessage('');
      } catch (error) {
        setProduct(null);
        setMessage('❌ Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [barcode]);

  const handleUpdate = async () => {
    if (!product) {
      setMessage('❌ Cannot update, product not loaded.');
      return;
    }
    // Remove _id and __v if present
    const { _id, __v, ...updatePayload } = product;
    updatePayload.quantity = Number(updatePayload.quantity);

    try {
      const response = await axios.put(
        `http://localhost:5004/products/${barcode.toLowerCase()}`,
        updatePayload
      );
      setMessage('✅ Product updated successfully');
      setProduct(response.data); // Update with latest data
    } catch (err) {
      console.error(err);
      setMessage('❌ Error updating product');
    }
  };

  const handleBarcodeSubmit = () => {
    if (inputBarcode) {
      navigate(`/update/${inputBarcode.toLowerCase()}`);
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="container py-5 px-10">
      <div className="card shadow-lg rounded">
        <div className="card-body">
          {barcode ? (
            <div>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status" />
                  <p className="mt-2">Loading product...</p>
                </div>
              ) : product ? (
                <>
                   <div className="product-icon"> 📦 <h3>{product.name.charAt(0).toUpperCase() + product.name.slice(1)}</h3>
                  
                      </div><div className="mb-3">
                    <label className="form-label">Product Barcode</label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.barcode}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={product.quantity}
                      onChange={e =>
                        setProduct({ ...product, quantity: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Warehouse</label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.warehouse}
                      onChange={e =>
                        setProduct({ ...product, warehouse: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Aisle (Container Code)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={product.containerCode}
                      onChange={e =>
                        setProduct({ ...product, containerCode: e.target.value })
                      }
                    />
                  </div>
                  <button className=" attractive-button btn w-10" onClick={handleUpdate}>
                    ✅ Update Product
                  </button>
                  {message && (
                    <div className="alert mt-3 text-center alert-info">{message}</div>
                  )}
                </>
              ) : (
                <div className="alert alert-danger text-center">{message}</div>
              )}
            </div>
          ) : (
            <>
              <p className="text-center">Enter a barcode to find a product to update:</p>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={inputBarcode}
                  onChange={e => setInputBarcode(e.target.value)}
                  placeholder="Enter product barcode"
                />
                <button className=" attractive-button btn w-10" onClick={handleBarcodeSubmit}>
                  🔍 Search
                </button>
              </div>
              {message && (
                <div className="alert mt-3 text-center alert-danger">{message}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdatePage;
