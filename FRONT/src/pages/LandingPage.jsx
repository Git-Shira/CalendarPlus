// Import React
import React from 'react';

// Import routing
import { useNavigate } from 'react-router-dom';

// Import styling components from MUI
import { Box, Typography } from '@mui/material';

const LandingPage = () => {
  const navigation = useNavigate();

  return (
    <Box className='landing-page'
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        backgroundImage: 'url(/background-desktop.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
          width: { xs: '90%', sm: '75%', md: '50%', lg: '40%' },
          margin: '0 auto',
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: '5rem',
            lineHeight: 1.2,
            background: 'linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9, #9b72cf, #c8b1e4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '3px 3px 4px rgba(0, 0, 0, 0.3)',
            textWrap: 'wrap',
          }}
        >
          Calendar Plus
        </Typography>

        <button className="btn" onClick={() => navigation('/login')}>
          <svg width="277" height="62">
            <defs>
              <linearGradient id="grad1">

                <stop offset="0%" stop-color="#496d4b" />
                <stop offset="14.29%" stop-color="#a3b18a" />
                <stop offset="28.57%" stop-color="#006d77" />
                <stop offset="42.86%" stop-color="#83c5be" />
                <stop offset="57.14%" stop-color="#1d8ea9" />
                <stop offset="71.43%" stop-color="#89c2d9" />
                <stop offset="85.71%" stop-color="#9b72cf" />
                <stop offset="100%" stop-color="#c8b1e4" />

              </linearGradient>
            </defs>
            <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad1)" width="266" height="50"></rect>
          </svg>
          <span>
            let's start →
          </span>
        </button>
      </Box>
    </Box>
  )
}

export default LandingPage;