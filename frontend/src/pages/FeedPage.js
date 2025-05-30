import React, { useState } from "react";
import axios from "axios";
import "./customStyles.css";
import { ToastContainer, toast } from "react-toastify";

function InventoryFeed() {
  const [selectedFile, setSelectedFile] = useState(null);
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
  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", selectedFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload-csv`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(
        `CSV uploaded successfully! ${response.data.inserted} products added.`
      );
      setSelectedFile(null); // Reset after upload
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading CSV file!");
    }
  };
  const handleFileChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      toast.error("No file selected!");
      return;
    }
    setSelectedFile(event.target.files[0]); // Ensure file exists
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
    <div className="container">
      <div
        className="mx-auto shadow p-4 bg-white"
        style={{ maxWidth: "500px", borderRadius: "12px" }}
      >
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
        <form onSubmit={handleSubmit} autoComplete="off">
          {Object.keys(formData).map((field) => (
            <div className="mb-3 align-items-center" key={field}>
              <div className="form-floating-custom">
                <input
                  type={field === "quantity" ? "number" : "text"}
                  id="name"
                  className="form-control"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <label htmlFor="name">{`Enter ${fieldLabels[field]}`}</label>
              </div>
            </div>
          ))}

          <div className="text-center mt-4">
            <button type="submit" className=" attractive-button btn w-10">
              <i className="bi bi-plus-circle"></i> Add Product
            </button>
          </div>
        </form>
        <input type="file" accept=".csv" onChange={handleFileChange} />

        <div className="text-center mt-3">
          <button onClick={handleFileUpload} className="btn btn-primary">
            <i className="bi bi-cloud-upload"></i> Upload CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryFeed;
