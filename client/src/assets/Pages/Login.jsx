import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../components/userContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo}=useContext(UserContext)
  async function login(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      if (response.ok) {
        // Login successful
        response.json().then(userInfo=>
          {
            setUserInfo(userInfo)
            setRedirect(true);
          }
        )
      } else {
        // Handle unsuccessful login
        console.error("Login failed:", response.statusText);
        alert("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      // Handle network errors
      console.error("Login error:", error);
      alert("Failed to connect to the server. Please try again later.");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form action="" className='login' onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder='username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
