import React from "react";
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContextApi from "./Pages/ContextApi/ContextApi";
import Home from "./Pages/Home/Home";
import Navbar from "./Pages/Navbar/Navbar";
import PrivateRoute from "./Pages/PrivateRoute/PrivateRoute";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Register/Login";
import Register from "./Pages/Register/Register";

function App() {
  return (
    <div className="App">
      <ContextApi>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<PrivateRoute>
              <Home/>
            </PrivateRoute>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </ContextApi>
    </div>
  );
}

export default App;
