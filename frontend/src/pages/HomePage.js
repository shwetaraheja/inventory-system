import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './customStyles.css';


function HomePage() {
    const { role, login } = useContext(AuthContext);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const handleLogin = () => {
    const success = login(code);
    if (!success) {
      setError('Invalid code. Please try again.');
    }
  };
 
return (
  <div className="container d-flex justify-content-center align-items-center min-vh-75">
    <div className="text-center w-100" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 fw-bold">Welcome to Harbor Point Mineral Products</h2>
      <p className="lead mb-4">What would you like to do today?</p>

      {!role ? (
        <div>
          <p className="lead">Please enter your access code:</p>
          <input 
            type="text" 
            value={code} 
            onChange={(e) => { setCode(e.target.value); setError(''); }} 
            placeholder="Enter code" 
            className="form-control mx-auto mb-3"
            style={{ maxWidth: '300px' }}
          />
          <button className=" attractive-button btn w-10" onClick={handleLogin} style={{backgroundColor: "#00336e" , color: "#fff"}}>
            Login
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
          <p className="text-muted mt-3">
            Hint: Use <strong>EDIT123</strong> for editor (full access) or <strong>VIEW456</strong> for viewer (read-only).
          </p>
        </div>
      ) : (
        <div>
          <p className="lead mb-4">
            You are logged in as <strong className="text-capitalize">{role}</strong>.
          </p>
          <div className="row justify-content-center">
            {role === 'editor' && (
              <div className="col-md-6 mb-3">
                
                <Link to="/feed" className=" attractive-button btn w-100">
                  ➕ Add Product to Inventory
                </Link>
              </div>
            )}
            {role === 'editor' && (
              <div className="col-md-6 mb-3">
                  <Link to="/delete" className=" attractive-button btn w-100"
               
               >
                 🗑️ delete Product from Inventory
                </Link>
              </div>
            )}
            <div className="col-md-6 mb-3">
                <Link to="/finder"className=" attractive-button btn w-100">
                  🔍 Find Product in Warehouse
                </Link>
              </div>
            {role === 'editor' ? (
              <div className="col-md-6 mb-3">
                  <Link to="/update"className=" attractive-button btn w-100"
                  >
                  ✏️ Update Product in Warehouse
                </Link>
              </div>
            ) : (
              <p className="text-muted mt-3">As a viewer, you cannot update product details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default HomePage;
