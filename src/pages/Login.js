import React from "react";
import { useState } from "react";
import { useAuth } from "../Context/AuthContextProvider";
import "../styles/Login.css";

const Login = () => {
  const [loading, setLoading] = useState();
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });

  const { googleSignIn, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = inputData;
    try {
      setLoading(true);
      await login(email, password);
      setInputData({ email: "", password: "" });
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("failed");
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

export default Login;
