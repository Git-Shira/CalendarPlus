// Import React and React hooks
import React, { useState } from 'react';

// Import routing
import { Link, useNavigate } from 'react-router-dom';

// Import axios for HTTP requests
import axios from "axios";

// Import styling components from MUI
import { Box, TextField, Typography, Alert, IconButton, InputAdornment } from '@mui/material';

// Import icons from MUI
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPage = (props) => {
  const port = import.meta.env.VITE_PORT;

  const navigation = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
    } else if (password.length < 8) {
      error.password = "The password is too short";
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
          `${port}/auth/login`,
          userData, {
          withCredentials: true
        });

        if (response.status === 200) {
          setError("");
          console.log("User connected successfully");
          setSuccess("User connected successfully");

          props.setUser(userData);

          setTimeout(() => {
            navigation("/dashboard")
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
    <Box className='login-page' sx={{
      display: 'flex',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      backgroundImage: { xs: 'url(/background-mobile.png)', lg: 'url(/background-desktop.png)' },
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
    }}>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
          width: { xs: '90%', sm: '75%', md: '50%', lg: '40%' },
          margin: '0 auto',

          '& .MuiTextField-root': {
            m: 0,
            width: { xs: '100%', sm: '40ch' },

            '& .MuiOutlinedInput-root': {
              position: 'relative',
              borderRadius: '16px',
              '& fieldset': {
                display: 'none',
              },
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '16px',
                padding: '2px',
                background: 'linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9, #9b72cf, #c8b1e4)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                zIndex: 0,
                transition: 'background 0.3s ease',
              },
              '&:hover:before': {
                padding: '3px',
              },
              '&.Mui-focused:before': {
                padding: '3px',
              },
              '& input': {
                position: 'relative',
                zIndex: 2,
              },
              zIndex: 0,
            },

            '& .MuiInputLabel-root': {
              position: 'absolute',
              top: '50%',
              left: '12px',
              transform: 'translateY(-50%)',
              backgroundColor: 'transparent',
              padding: '0 4px',
              zIndex: 3,
              transition: 'all 0.3s ease',
              color: "#496d4b",
            },

            '& .MuiInputLabel-shrink': {
              top: '-8px',
              transform: 'translateY(0)',
              backgroundColor: '#f0f8f4 !important',
              padding: '0 4px',
            },

            '& .Mui-focused.MuiInputLabel-root, :hover .MuiInputLabel-root': {
              fontWeight: 'bold'
            },
          },
        }}

        noValidate
        autoComplete="off"
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: '3.3rem',
            lineHeight: 1.2,
            background: 'linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9, #9b72cf, #c8b1e4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '3px 3px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
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
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}

          error={validationError.password}
          helperText={validationError.password}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end"
                    sx={{ color: '#c8b1e4', outline: 'none !important' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <button className="btn" onClick={handleSubmit}
          disabled={password.trim() == "" || email.trim() == ""}
        >
          <svg width="277" height="62">
            <defs>
              <linearGradient id="grad1">
                {!(password.trim() == "" || email.trim() == "")
                  ?
                  <>
                    <stop offset="0%" stop-color="#496d4b" />
                    <stop offset="14.29%" stop-color="#a3b18a" />
                    <stop offset="28.57%" stop-color="#006d77" />
                    <stop offset="42.86%" stop-color="#83c5be" />
                    <stop offset="57.14%" stop-color="#1d8ea9" />
                    <stop offset="71.43%" stop-color="#89c2d9" />
                    <stop offset="85.71%" stop-color="#9b72cf" />
                    <stop offset="100%" stop-color="#c8b1e4" />
                  </> : <>
                    <stop offset="0%" stop-color="#ccc" />
                  </>}
              </linearGradient>
            </defs>
            <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad1)" width="266" height="50"></rect>
          </svg>
          <span>
            Login
          </span>
        </button>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          mt: 3,
          width: { xs: '100%', sm: '40ch', md: '50ch' },
        }}>
          <Link to="/forgot-password" variant="body2" underline="hover"
            style={{
              color: '#c8b1e4'
            }}
          >
            Forgot password
          </Link>
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          mt: 0,
          width: { xs: '100%', sm: '40ch', md: '50ch' },
        }}>

          <Typography variant="body2" color="textSecondary"
            sx={{
              background: 'linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              paddingTop: '5px'
            }}>
            Don’t have an account?
          </Typography>
          <Link to="/register" variant="body2" color="primary" underline="hover"
            style={{
              color: "#c8b1e4",
            }}>
            Create one
          </Link>
        </Box>

        {success && (
          <Alert
            variant="outlined"
            severity="success"
            sx={{
              mt: 2,
              width: { xs: '90%', sm: '40ch' },
              backgroundColor: '#f0f8f4',
              boxShadow: '0 0 20px 10px #f0f8f4',
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
              width: { xs: '90%', sm: '40ch' },
              backgroundColor: '#f0f8f4',
              boxShadow: '0 0 20px 10px #f0f8f4',
            }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  )
}

export default LoginPage;