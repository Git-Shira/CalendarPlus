import React, { useState } from 'react'

import axios from "axios";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

 import { Link } from 'react-router-dom';

 const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: name,
      email: email,
      password: password
    };

    try {
      if (password === verifyPassword) {
        const response = await axios.post(
          "http://localhost:3000/auth/register",
          userData
        );

        if (response.status === 200) {
          localStorage.setItem("user", email);
          console.log("User created successfully");
        }
      }
    } catch (error) {
      if (error.response.status === 400)
        console.error("User already exist");

      if (error.response.status === 500)
        console.error("Something went wrong");

      console.error(error);
    }
  }

  return (
    <div>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >

        <TextField
          required
          id="standard-required RegisterName"
          label="Name"
          variant="standard"

          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          required
          id="standard-required RegisterEmail"
          label="Email address"
          variant="standard"

          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          id="standard-password-input RegisterPassword"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"

          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          id="standard-password-input RegisterVerifyPassword"
          label="Verify Password"
          type="password"
          autoComplete="current-password"
          variant="standard"

          value={verifyPassword}
          onChange={(e) => setVerifyPassword(e.target.value)}
        />

        <button
          disabled={password !== verifyPassword}
          onClick={password === verifyPassword && handleSubmit}>
          Register
        </button>
        
      </Box>

      <h5>already have an account?</h5>
      <Link to="/">log in</Link>
    </div>
  )
}

export default Register;