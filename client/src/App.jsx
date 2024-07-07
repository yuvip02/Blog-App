import React from "react";
import "./App.css";
import Post from "./assets/components/Post";
import Header from "./assets/components/Header";
import { Route,Routes } from "react-router-dom";
import Login from "./assets/Pages/Login";
import Layout from "./assets/layout/Layout";
import IndexPage from "./assets/Pages/IndexPage";
import RegisterPage from "./assets/Pages/RegisterPage";
import { UserContextProvider } from "./assets/components/userContext";
import CreatePost from "./assets/Pages/CreatePost";
import PostPage from "./assets/Pages/PostPage";
import EditPost from "./assets/Pages/EditPost"


const App = () => {
  return (
    <UserContextProvider>


    <Routes>
      <Route path="/" element={<Layout/>}>

            <Route index element={<IndexPage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/Register" element={<RegisterPage/>}/>
            <Route path="/post" element={<CreatePost/>}/>
            <Route path="/post/:id" element={<PostPage/>}/>
            <Route path="/edit/:id" element={<EditPost/>}/>
      
      </Route>

      </Routes>
    </UserContextProvider>
  );
};

export default App;
