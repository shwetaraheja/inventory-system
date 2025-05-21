import React, { useState } from "react";
import axios from "axios";
import "./customStyles.css";
import { ToastContainer, toast } from "react-toastify";

function InventoryFeed() {
  const fieldLabels = {
    barcode: "Barcode",
    name: "Product Name",
    quantity: "Quantity",
    warehouse: "Warehouse Location",
    containerCode: "Aisle",
  };

  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    quantity: "",
    warehouse: "",
    containerCode: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      containerCode: formData.containerCode.toLowerCase(),
    };
    // const BASE_URL = process.env.REACT_APP_BACKEND_URL;

    try {
      const BASE_URL = process.env.REACT_APP_BACKEND_URL;
      await axios.post(`${BASE_URL}/products`, normalizedData);

      toast.info("Product added successfully!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setFormData({
        barcode: "",
        name: "",
        quantity: "",
        warehouse: "",
        containerCode: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      //alert('Something went wrong.');
      toast.error("Something went wrong!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="mx-auto"
        style={{ maxWidth: "700px", borderRadius: "12px" }}
      >
        <div className="">
          <h2
            className="text-center mb-4"
            style={{
              color: "#00336e",
              fontWeight: "bold",
            }}
          >
            Add New Product
          </h2>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => (
              <div className="mb-3 d-flex align-items-center" key={field}>
                <div className="col-sm-9">
                  <div class="form-floating-custom">
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder=""
                      required
                    />
                    <label for="name">{`Enter ${fieldLabels[field]}`}</label>
                  </div>
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
