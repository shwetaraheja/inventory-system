import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
 import { useContext, useState  } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import HomePage from "./pages/HomePage";
import InventoryFeed from "./pages/FeedPage";
import InventoryFinder from "./pages/FinderPage";
import UpdateProduct from "./pages/UpdatePage";
import DeleteProduct from "./pages/DeletePage";
import Footer from "./pages/footer";


// A simple navbar component using the AuthContext
function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  // Place the following lines at the top of your component (inside the function)
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const handleLogout = () => {
    logout();           // reset the authentication context
    navigate('/');      // redirect back to the login/home page
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#00336e" }}>
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">
        <img
          src="/logo.png"
          alt="Harbor Point Logo"
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            objectFit: 'contain',
            backgroundColor: '#fff',
            padding: '5px',
          }}
        />
        </Link>
        <Link className="navbar-brand" to="/" style={{ color: "#fff", fontSize: "16px" , fontWeight:"bold" }}>Home</Link>
        <Link className="navbar-brand" to="/feed" style={{ color: "#fff", fontSize: "16px", fontWeight:"bold"}}>Add Product</Link>  
        <Link className="navbar-brand" to="/finder" style={{ color: "#fff", fontSize: "16px" , fontWeight:"bold" }}>Find Product</Link>
        <Link className="navbar-brand" to="/update" style={{ color: "#fff", fontSize: "16px" , fontWeight:"bold"}}>Update Product</Link>
        <Link className="navbar-brand" to="/delete" style={{ color: "#fff", fontSize: "16px" , fontWeight:"bold" }}>Delete Product</Link>
      {/* Custom toggler button */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        style={{ borderColor: 'white' }}
      >
        {/* Simple hamburger icon */}
        <span style={{
          display: 'block',
          width: '25px',
          height: '3px',
          marginBottom: '5px',
          backgroundColor: 'white',
        }}></span>
        <span style={{
          display: 'block',
          width: '25px',
          height: '3px',
          marginBottom: '5px',
          backgroundColor: 'white',
        }}></span>
        <span style={{
          display: 'block',
          width: '25px',
          height: '3px',
          backgroundColor: 'white',
        }}></span>
      </button>

      {/* Show/hide menu based on state */}
      <div className={`navbar-collapse ${isOpen ? 'show' : 'collapse'}`} id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto">
          {role && (
            <>
              <li className="nav-item">
                <span className="nav-link" style={{ color: "#fff " }}>Role: {role}</span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-secondary nav-link"
                  onClick={handleLogout}
                  style={{ color: "#fff" }}
                >
                  Switch User
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  </nav>
);
}
function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}>
        <AppNavbar />
          <div className="container mt-5 " style={{
            flex: 1,
         }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/feed" element={<InventoryFeed />} />
            <Route path="/finder" element={<InventoryFinder />} />
            <Route path="/update" element={<UpdateProduct />} />
            <Route path="/update/:barcode" element={<UpdateProduct />} />
            <Route path="/delete" element={<DeleteProduct />} />
          </Routes>
        </div>
          <Footer />
          </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
