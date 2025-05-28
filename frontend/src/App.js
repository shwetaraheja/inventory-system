import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import HomePage from "./pages/HomePage";
import InventoryFeed from "./pages/FeedPage";
import InventoryFinder from "./pages/FinderPage";
import UpdateProduct from "./pages/UpdatePage";
import DeleteProduct from "./pages/DeletePage";
import Footer from "./pages/footer";
import ListPage from "./pages/listPage";

function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMenu();
  };

  const desktopNavLinks = (
    <div className="navbar-nav">
      {role === "editor" && (
        <>
          <Link className="nav-link text-white" to="/feed">
            Add Product
          </Link>
          <Link className="nav-link text-white" to="/update">
            Update Product
          </Link>
          <Link className="nav-link text-white" to="/delete">
            Delete Product
          </Link>
        </>
      )}
      {(role === "editor" || role === "viewer") && (
        <>
          <Link className="nav-link text-white" to="/finder">
            Find Product
          </Link>
          <Link className="nav-link text-white" to="/list">
            List
          </Link>
        </>
      )}
      {role && (
        <>
          <span className="nav-link text-white disabled">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
          <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );

  const mobileNavLinks = (
    <div className="d-flex flex-column">
      {role === "editor" && (
        <>
          <Link
            className="text-white py-2 px-3"
            style={{ textDecoration: "none" }}
            to="/feed"
            onClick={closeMenu}
          >
            Add Product
          </Link>
          <Link
            className="text-white py-2 px-3"
            style={{ textDecoration: "none" }}
            to="/update"
            onClick={closeMenu}
          >
            Update Product
          </Link>
          <Link
            className="text-white py-2 px-3"
            style={{ textDecoration: "none" }}
            to="/delete"
            onClick={closeMenu}
          >
            Delete Product
          </Link>
        </>
      )}
      {(role === "editor" || role === "viewer") && (
        <>
          <Link
            className="text-white py-2 px-3"
            to="/finder"
            onClick={closeMenu}
            style={{ textDecoration: "none" }}
          >
            Find Product
          </Link>
          <Link
            className="text-white py-2 px-3"
            to="/list"
            onClick={closeMenu}
            style={{ textDecoration: "none" }}
          >
            List
          </Link>
        </>
      )}
      {role && (
        <>
          <span className="text-white py-2 px-3">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
          <button className="btn btn-outline-light m-2" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#00336e", padding: "10px 20px" }}
    >
      <div className="container-fluid">
        {/* Logo and Home */}
        <Link
          className="navbar-brand d-flex align-items-center text-white"
          to="/"
          onClick={closeMenu}
        >
          <img
            src="/logo.png"
            alt="Harbor Point Logo"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              padding: "5px",
              marginRight: "10px",
            }}
          />
        </Link>

        {/* Toggle Button for Mobile */}
        <button className="navbar-toggler" type="button" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Desktop Menu */}
        <div className="collapse navbar-collapse d-none d-lg-flex justify-content-end">
          {desktopNavLinks}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="d-lg-none text-white"
          style={{
            backgroundColor: "#00336e",
            position: "absolute",
            top: "100%",
            right: 0,
            width: "60%",
            zIndex: 1000,
            borderBottomRightRadius: "10px",
            opacity: 0.95,
          }}
        >
          {mobileNavLinks}
        </div>
      )}
    </nav>
  );
}
function App() {
  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <AppNavbar />
          <div
            className="container mt-5 "
            style={{
              flex: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/feed" element={<InventoryFeed />} />
              <Route path="/finder" element={<InventoryFinder />} />
              <Route path="/update" element={<UpdateProduct />} />
              <Route path="/update/:barcode" element={<UpdateProduct />} />
              <Route path="/delete" element={<DeleteProduct />} />
              <Route path="/list" element={<ListPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
