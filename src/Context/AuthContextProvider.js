import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { auth } from "../firebase/firebase";

const authContext = createContext();

export const useAuth = () => {
  return useContext(authContext);
};

const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [availableUser, setAvailableUser] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setAvailableUser(user);
      setLoading(false);
    });
  }, []);

  const signup = async (username, email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {
      displayName: username,
    });

    const user = auth.currentUser;
    setAvailableUser({ ...user });
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const googleSignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };

  const value = {
    signup,
    login,
    logout,
    googleSignIn,
    availableUser,
  };

  return (
    <authContext.Provider value={value}>
      {!loading && children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;
