// Import routing components
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Import React hooks
import { useEffect, useState } from 'react';

// Import axios for HTTP requests
import axios from 'axios';

// Import pages
import LandingPage from "./pages/LandingPage";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";

// Import styles
import './App.css';

function App() {
  const port = import.meta.env.VITE_PORT;

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${port}/auth/`,
        {
          withCredentials: true
        });

      if (response.status === 200) {
        setUser({
          name: response.data.user.name,
          email: response.data.user.email,
        });
        console.log("User profile retrieved successfully");
      }

    } catch (error) {
      if (error.response.status === 400)
        console.error("Access denied. No token provided.");

      if (error.response.status === 401)
        console.error("User not found");

      if (error.response.status === 500)
        console.error("Something went wrong");

      console.error(error);
    }
  };

  useEffect(() => {
    if (user.name === "" && user.email === "")
      getUser();
  }, [user.name, user.email]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user && user.name !== '' && user.email !== '' ? <Navigate to="/dashboard" /> : <LandingPage />} />

        <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/dashboard" element={user && user.name !== '' && user.email !== '' ? <DashboardPage user={user} getUser={getUser} /> : <Navigate to="/" />} />

        <Route path="*" element={user && user.name !== '' && user.email !== '' ? <Navigate to="/dashboard" /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App