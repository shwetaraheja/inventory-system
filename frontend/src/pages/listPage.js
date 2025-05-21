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
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">Product Inventory</h3>
        <div className="table-responsive">
          <table className="table table-hover no-border-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Barcode</th>
                <th scope="col">Product Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Warehouse</th>
                <th scope="col">Aisle</th>
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
