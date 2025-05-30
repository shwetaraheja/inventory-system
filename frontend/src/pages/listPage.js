import React, { useState, useEffect } from "react";
import "./customStyles.css";

const ListPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 20;
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      const data = await response.json();

      // Sort alphabetically by warehouse (case-insensitive)
      data.sort((a, b) =>
        a.warehouse.localeCompare(b.warehouse, undefined, {
          sensitivity: "base",
        })
      );

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const downloadCSV = () => {
    if (products.length === 0) return;

    const headers = [
      "Barcode",
      "Product Name",
      "Quantity",
      "Warehouse",
      "Aisle",
    ];
    const rows = products.map((p) => [
      p.barcode,
      p.name,
      p.quantity,
      p.warehouse,
      p.containerCode,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_inventory.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3">
        <button className=" attractive-button btn " onClick={downloadCSV}>
          ⬇️ Download CSV
        </button>
      </div>
      <div className="card shadow p-4">
        <h3 className="text-center mb-4" style={{ color: "#00336e" }}>
          Product Inventory
        </h3>
        <div className="table-responsive">
          <table className="table table-hover no-border-table">
            <thead>
              <tr>
                <th scope="col" style={{ color: "#00336e" }}>
                  #
                </th>
                <th style={{ color: "#00336e" }} scope="col">
                  Barcode
                </th>
                <th style={{ color: "#00336e" }} scope="col">
                  Product Name
                </th>
                <th style={{ color: "#00336e" }} scope="col">
                  Quantity
                </th>
                <th style={{ color: "#00336e" }} scope="col">
                  Warehouse
                </th>
                <th style={{ color: "#00336e" }} scope="col">
                  Aisle
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product, index) => (
                  <tr key={product.barcode}>
                    <th scope="row">
                      {(currentPage - 1) * PRODUCTS_PER_PAGE + index + 1}
                    </th>
                    <td>{product.barcode}</td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.warehouse}</td>
                    <td>{product.containerCode}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination justify-content-center mt-3">
          <button
            className="btn btn-outline-secondary mx-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={`btn mx-1 ${
                currentPage === idx + 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button
            className="btn btn-outline-secondary mx-1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListPage;
