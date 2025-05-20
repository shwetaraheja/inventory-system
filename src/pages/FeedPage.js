import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './customStyles.css';

function InventoryFeed() {
  const fieldLabels = {
    barcode: "Barcode",
    name: "Product Name",
    quantity: "Quantity",
    warehouse: "Warehouse Location",
    containerCode: "Aisle"
  };
  
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    barcode: '',
    name: '',
    quantity: '',
    warehouse: '',
    containerCode: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert fields to lowercase before sending
    const normalizedData = {
      ...formData,
      barcode: formData.barcode.toLowerCase(),
      name: formData.name.toLowerCase(),
      warehouse: formData.warehouse.toLowerCase(),
      containerCode: formData.containerCode.toLowerCase()
    };
  
    try {
      await axios.post('http://localhost:5004/products', normalizedData);
      alert('Product added successfully!');
      setFormData({
        barcode: '',
        name: '',
        quantity: '',
        warehouse: '',
        containerCode: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Something went wrong.');
    }
  };
  
  return (
  <div className="container mt-5">
    <div className="mx-auto" style={{ maxWidth: "700px", borderRadius: "12px" }}>
      <div className="">
        <h2 className="text-center mb-4" style={{
                color: '#00336e',
                fontWeight: 'bold',
              }}>Add New Product</h2>

        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div className="mb-3 d-flex align-items-center" key={field}>
              <label className="col-sm-3 col-form-label fw-bold">{fieldLabels[field]}</label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control "
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${fieldLabels[field]}`}
                  required
                />
              </div>
            </div>
          ))}

          <div className="text-center mt-4">
              <button type="submit" className=" attractive-button btn w-10">
              <i className="bi bi-plus-circle"></i> Add Product
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
);

}

export default InventoryFeed;
