import React, { useState } from 'react'

import axios from "axios";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Button } from '@mui/material'; 

import Alert from '@mui/material/Alert';

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");

  const navigation = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationError, setValidationError] = useState({});
  const validate = () => {
    const error = {};
    if (!name) {
      error.name = "Required field";
    } else if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(name)) {
      error.name = "Please enter a valid full name without leading or trailing spaces.";
    }
    if (!email) {
      error.email = "Required field";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error.email = "Invalid email address";
    }
    if (!password) {
      error.password = "Required field";
    }
    if (password !== confirmationPassword) {
      error.confirmationPassword = "The confirmation password must match the original password.";
    }

    setValidationError(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const userData = {
        name: name,
        email: email,
        password: password
      };

      try {
        if (password === confirmationPassword) {
          const response = await axios.post(
            "http://localhost:3000/auth/register",
            userData, {
              withCredentials: true 
          });
          

          if (response.status === 200) {
            // const user = response.data.user;
            // localStorage.setItem("user", JSON.stringify(user));
            setError("");
            console.log("User created successfully");
            setSuccess("User created successfully");
            setTimeout(() => {
              navigation("/login")
            }, 2000);
          }
        }
      } catch (error) {
        setSuccess("");
        if (error.response.status === 400) {
          console.error("User already exist");
          setError("User already exist");
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
    <div className='signup-page' style={{ display: 'flex', justifyContent: 'flex-start' }}>
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
          Signup
        </Typography>

        <TextField
          required
          id="outlined-required SignupName"
          label="Name"
          variant="outlined"

          value={name}
          onChange={(e) => setName(e.target.value)}

          error={validationError.name}
          helperText={validationError.name}
        />
        <br />
        <TextField
          required
          id="outlined-required SignupEmail"
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
          id="outlined-password-input SignupPassword"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"

          value={password}
          onChange={(e) => setPassword(e.target.value)}

          error={validationError.password}
          helperText={validationError.password}
        />
        <br />
        <TextField
          required
          id="outlined-password-input SignupconfirmationPassword"
          label="Confirmation Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"

          value={confirmationPassword}
          onChange={(e) => setConfirmationPassword(e.target.value)}

          error={validationError.confirmationPassword}
          helperText={validationError.confirmationPassword}
        />

        <Button
          variant="contained"
          disabled={name.trim() == "" || email.trim() == "" || password.trim() == "" || password !== confirmationPassword}
          onClick={password === confirmationPassword && handleSubmit}
          sx={{
            backgroundColor: 'primary.main', 
            color: 'white', 
            padding: '12px', 
            fontSize: '16px', 
            borderRadius: '4px', 
          }}
        >
          Signup
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
            Already have an account?
          </Typography>
          <Link to="/login" variant="body2" color="primary" underline="hover">
            Log in
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

export default SignupPage