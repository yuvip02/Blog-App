import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:5173/profile", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const userInfo = await response.json();
        setUserInfo(userInfo);

      } catch (error) {
        console.error("Fetch error:", error);
        setUserInfo({ username: "Default User" });
      }
    };

    fetchUserInfo();
  }, [setUserInfo]);

  function logout() {
    fetch("http://localhost:5173/logout", {
      credentials: "include",
      method: "POST",
    })
      .then(() => setUserInfo(null))
      .catch((error) => console.error("Logout error:", error));
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">YourNarrative</Link>
      <nav>
        {username ? (
          <>
            <Link to="/post" className="auth-link">Create new Post</Link>
            <a href="#logout" className="auth-link" onClick={logout}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/register" className="auth-link">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
