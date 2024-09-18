import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Register from './pages/Register'
import Login from './pages/Login';

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-an-account" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App