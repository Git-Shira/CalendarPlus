import React, { useState } from 'react'

import axios from "axios";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Button } from '@mui/material'; 

// import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { login } from '../Redux/userSlice';

import Alert from '@mui/material/Alert';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigate();


  // const dispatch = useDispatch();
  // const user = useSelector((state)=>state.user);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationError, setValidationError] = useState({});
  const validate = () => {
    const error = {};
    if (!email) {
      error.email = "Required field";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error.email = "Invalid email address";
    }
    if (!password) {
      error.password = "Required field";
    }

    setValidationError(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const userData = {
        email: email,
        password: password
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/auth/login",
          userData, {
            withCredentials: true 
        });

        if (response.status === 200) {
          // const user = response.data.user;
          // dispatch(login(user));
          // localStorage.setItem("user", JSON.stringify(user));
          setError("");
          console.log("User connected successfully");
          setSuccess("User connected successfully");
          setTimeout(() => {
            navigation("/calendar")
          }, 2000);
        }
      } catch (error) {
        setSuccess("");
        if (error.response.status === 400) {
          console.error("User does not exist");
          setError("User does not exist");
        }
        if (error.response.status === 405) {
          console.error("Wrong Password");
          setError("Wrong Password");
        }
        if (error.response.status === 500) {
          console.error("Something went wrong");
          setError("Something went wrong");
        }

        console.error(error);
      }
    }
  }

  return (
    <div className='login-page' style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
          padding: 3,
          width: { xs: '90%', sm: '75%', md: '50%', lg: '40%' }, 
          marginLeft: '0', 
          marginRight: 'auto', 
          '& .MuiTextField-root': {
            m: 1,
            width: { xs: '100%', sm: '40ch', md: '50ch' }, 
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main', 
              },
              '&:hover fieldset': {
                borderColor: 'secondary.main', 
              },
              '&.Mui-focused fieldset': {
                borderColor: 'secondary.main', 
              },
            },
          },
          '& .MuiButton-root': {
            mt: 2,
            width: { xs: '98%', sm: '38ch', md: '48ch' }, 

            padding: '10px 20px',
            '&:hover': {
              backgroundColor: 'secondary.main', 
              transform: 'scale(1.05)', 
              transition: 'transform 0.2s ease', 
            },
          },
        }}
        noValidate
        autoComplete="off"
      >

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login
        </Typography>

        <TextField
          required
          id="outlined-required LoginEmail"
          label="Email address"
          variant="outlined"

          value={email}
          onChange={(e) => setEmail(e.target.value)}

          error={validationError.email}
          helperText={validationError.email}
        />
        <br />
        <TextField
          required
          id="outlined-password-input LoginPassword"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"

          value={password}
          onChange={(e) => setPassword(e.target.value)}

          error={validationError.password}
          helperText={validationError.password}
        />

        <Button
          disabled={password.trim()=="" || email.trim()==""}
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white', 
            padding: '12px', 
            fontSize: '16px', 
            borderRadius: '4px', 
          }}
        >
          Login
        </Button>



        <Box sx={{
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center',
          gap: 1,
          mt: 2,
          width: { xs: '100%', sm: '40ch', md: '50ch' }, 
        }}>
          <Typography variant="body2" color="textSecondary">
            Don’t have an account?
          </Typography>
          <Link to="/register" variant="body2" color="primary" underline="hover">
            Create one
          </Link>
        </Box>

        {success && (
          <Alert
            variant="outlined"
            severity="success"
            sx={{
              mt: 2,
              width: { xs: '100%', sm: '40ch', md: '50ch' }, 
            }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert
            variant="outlined"
            severity="error"
            sx={{
              mt: 2,
              width: { xs: '100%', sm: '40ch', md: '50ch' }, 
            }}>
            {error}
          </Alert>
        )}
      </Box>

    </div>
  )
}

export default LoginPage