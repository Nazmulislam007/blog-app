import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../Context/AuthContextProvider";

const Register = () => {
  const [loading, setLoading] = useState();
  const [inputData, setInputData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { signup, googleSignIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = inputData;
    try {
      setLoading(true);
      await signup(username, email, password);
      alert("user created successfully");
      setInputData({ username: "", email: "", password: "" });
      navigate("/", { replace: true });
      setLoading(false);
    } catch (error) {
      alert("register error alert");
      console.log(error);
      setLoading(false);
    }
  };

  const inputOnChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const loginWithGoogle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await googleSignIn();
      navigate("/", { replace: true });
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={inputData.username}
        placeholder="Enter Username"
        required
        onChange={inputOnChange}
      />
      <input
        type="email"
        name="email"
        value={inputData.email}
        placeholder="Enter Email"
        required
        onChange={inputOnChange}
      />
      <input
        type="password"
        name="password"
        value={inputData.password}
        placeholder="Enter Password"
        required
        onChange={inputOnChange}
      />
      <button disabled={loading ? true : false}>Submit</button>
      <button type="button" onClick={loginWithGoogle}>
        Login With Google
      </button>
    </form>
  );
};

export default Register;
