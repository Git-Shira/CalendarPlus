import React, { useState } from 'react'

import axios from "axios";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const userData = {
          email: email,
          password: password
        };
    
        try {
            const response = await axios.post(
              "http://localhost:3000/auth/login",
              userData
            );
    
            if (response.status === 200) {
                const user = response.data.user;
              localStorage.setItem("user", JSON.stringify(user));
              console.log("User connected successfully");
            }
        } catch (error) {
          if (error.response.status === 400)
            console.error("User does not exist");
    
          if (error.response.status === 405)
            console.error("Wrong Password");
    
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
          id="standard-required LoginEmail"
          label="Email address"
          variant="standard"

          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          id="standard-password-input LoginPassword"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"

          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          Log In
        </button>
      </Box>

      <h5>dont have an account?</h5>
      <Link to="create-an-account">create one</Link>
    </div>
    )
}

export default Login