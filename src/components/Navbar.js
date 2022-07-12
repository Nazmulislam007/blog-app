import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContextProvider";

const Navbar = () => {
  const { availableUser, logout } = useAuth();
  return (
    <nav>
      <Link to="/">Home</Link>
      {availableUser ? (
        <div>
          <p>{availableUser?.displayName}</p>
          <button onClick={logout}>LogOut</button>
        </div>
      ) : (
        <div>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
