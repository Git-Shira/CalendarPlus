// Import React and React hooks
import React, { useState } from 'react';

// Import routing
import { useNavigate } from 'react-router-dom';

// Import third-party libraries
import OtpInput from 'react-otp-input';
import axios from 'axios';

// Import styling components from MUI
import { Box, Stepper, Step, StepLabel, StepContent, Typography, TextField, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';

const steps = [
    {
        label: 'Enter your email',
        description: 'Enter your email to receive a reset code.'
    },
    {
        label: 'Verify the code',
        description: 'Enter the code sent to your email to verify your identity.',
    },
    {
        label: 'Set a new password',
        description: 'Enter your new password to complete the reset process.',
    },
];

const ForgotPasswordPage = () => {
    const port = import.meta.env.VITE_PORT;

    const isSmallScreen = useMediaQuery('(min-width:720px), (min-width:350px) and (max-width:600px)');

    const [activeStep, setActiveStep] = useState(0);

    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [showConfirmationPassword, setShowConfirmationPassword] = useState(false);
    const toggleConfirmationPasswordVisibility = () => {
        setShowConfirmationPassword(!showConfirmationPassword);
    };

    const [validationError, setValidationError] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validateEmail = () => {
        if (!email) {
            setValidationError((prevState) => ({
                ...prevState,
                email: "Required field"
            }));
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setValidationError((prevState) => ({
                ...prevState,
                email: "Invalid email address"
            }));
            return false;
        }

        return true;
    }

    const validateResetCode = () => {
        if (!resetCode) {
            setValidationError((prevState) => ({
                ...prevState,
                resetCode: "Required field"
            }));
            return false;
        }
        else if (resetCode.length !== 6) {
            setValidationError((prevState) => ({
                ...prevState,
                resetCode: "Reset code must be 6 characters long"
            }));
            return false;
        }
        return true;
    }

    const validatePasswords = () => {
        if (!newPassword) {
            setValidationError((prevState) => ({
                ...prevState,
                password: "Required field"
            }));
            return false;
        } else if (newPassword.length < 8) {
            setValidationError((prevState) => ({
                ...prevState,
                password: "The password must be at least 8 characters long"
            }));
            return false;
        }

        if (newPassword !== confirmationPassword) {
            setValidationError((prevState) => ({
                ...prevState,
                confirmationPassword: "The confirmation password must match the original password"
            }));
            return false;
        }

        return true;
    }

    const sendResetCode = async () => {
        if (!validateEmail()) return;

        try {
            const response = await
                axios.post(`${port}/auth/forgot-password`,
                    { email }, {
                    withCredentials: true
                });

            if (response.status === 200) {
                setError("");
                setActiveStep(1);

                console.log("Reset code sent successfully");
            }

        } catch (error) {
            setSuccess("");
            let errorMessage = ['Failed to send reset code'];
            if (error.response.status === 400) {
                console.error("User not found");
                errorMessage.push("➡ User not found");
            }

            if (error.response.status === 500) {
                console.error("Something went wrong");
                errorMessage.push("➡ Something went wrong");
            }

            setError(errorMessage)
            console.error(error);
        }
    }

    const verifyCode = async () => {
        if (!validateResetCode()) return;

        try {
            const response = await
                axios.post(`${port}/auth/verify-code`, { code: resetCode }, {
                    withCredentials: true
                });
            if (response.status === 200) {
                setError("");
                setActiveStep(2);

                console.log("Reset code verified successfully");
            }

        } catch (error) {
            setSuccess("");
            let errorMessage = ['Wrong reset code'];

            if (error.response.status === 400) {
                console.error("Invalid or expired reset code");
                errorMessage.push("➡ Invalid or expired reset code");
            }

            if (error.response.status === 500) {
                console.error("Something went wrong");
                errorMessage.push("➡ Something went wrong");
            }

            setError(errorMessage);
            console.error(error);
        }
    }

    const resetPassword = async () => {
        if (!validatePasswords()) return;

        try {
            const response = await
                axios.post(`${port}/auth/reset-password`,
                    { resetCode, newPassword }, {
                    withCredentials: true
                });
            if (response.status === 200) {
                setError("");
                setSuccess("Password reset successfully");

                setTimeout(() => {
                    setActiveStep(3);
                }, 2000);

                console.log("Password reset successfully");
            }

        } catch (error) {
            setSuccess("");
            let errorMessage = ['Failed to reset password'];

            if (error.response.status === 400) {
                console.error("Reset code and new password are required");
                errorMessage.push("➡ Reset code and new password are required");
            }

            if (error.response.status === 404) {
                console.error("Invalid or expired reset code");
                errorMessage.push("➡ Invalid or expired reset code");
            }

            if (error.response.status === 500) {
                console.error("Something went wrong");
                errorMessage.push("➡ Something went wrong");
            }

            setError(errorMessage);

            console.error(error);
        }
    }

    const handleNext = () => {
        setError("");
        setSuccess("");

        setValidationError({});

        if (activeStep === 0) {

            sendResetCode();
        } else if (activeStep === 1) {

            verifyCode();
        } else if (activeStep === 2) {

            resetPassword();
        }
    };

    const handleChange = (otp) => {
        setResetCode(otp);
    };

    const navigate = useNavigate();

    return (
        <Box className='forgot-password' sx={{
            display: 'flex', justifyContent: 'flex-start', minHeight: '100vh',
            backgroundImage: { xs: 'url(/background-mobile.png)', lg: 'url(/background-desktop.png)' },
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
        }}>
            <Box
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
                        fontSize: { xs: '2.5rem', sm: '3.3rem' },
                        lineHeight: 1.2,
                        background: 'linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9, #9b72cf, #c8b1e4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',

                        textShadow: '3px 3px 4px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    Reset Password
                </Typography>

                <Stepper activeStep={activeStep} orientation="vertical" sx={{
                    width: { sm: '60%', md: '70%', lg: '80%' },
                    background: activeStep === 2 ? '#f0f8f4' : 'transparent', padding: 2
                }}>
                    {steps.map((step, index) => (
                        <Step key={step.label}
                            sx={{
                                alignItems: 'center',
                                '& .MuiStepLabel-label': {
                                    color:
                                        activeStep >= index
                                            ? (index === 0 ? '#a3b18a' : index === 1 ? '#83c5be' : '#c8b1e4')
                                            : activeStep > index
                                                ? (index === 0 ? '#a3b18a' : index === 1 ? '#83c5be' : '#c8b1e4')
                                                : '#b0b0b0',
                                },
                                '& .Mui-active': {
                                    color:
                                        (index === 0 ? '#a3b18a !important' : index === 1 ? '#83c5be !important' : '#c8b1e4 !important')
                                },
                                '& .MuiStepIcon-root': {
                                    color:
                                        activeStep >= index
                                            ? (index === 0 ? '#a3b18a !important' : index === 1 ? '#83c5be !important' : '#c8b1e4 !important') : '#b0b0b0',
                                },
                                '& .Mui-completed': {
                                    color:
                                        activeStep >= index
                                            ? (index === 0 ? '#a3b18a !important' : index === 1 ? '#83c5be !important' : '#c8b1e4 !important') : '#b0b0b0',
                                },
                            }}>
                            <StepLabel>{step.label}</StepLabel>

                            <StepContent>
                                <Typography sx={{ margin: '0 auto', maxWidth: '300px', color: activeStep === 0 ? '#496d4b' : activeStep === 1 ? '#006d77' : '#9b72cf', textAlign: 'start' }}>{step.description}</Typography>
                                <Box
                                    sx={{
                                        marginLeft: '0',
                                        marginRight: 'auto',
                                        '& .MuiTextField-root': {
                                            m: 2,
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
                                                    background: activeStep === 0 ? 'linear-gradient(to right, #496d4b, #a3b18a,#496d4b)' : activeStep === 1 ? 'linear-gradient(to right, #006d77, #83c5be)' : 'linear-gradient(to right,#c8b1e4,  #9b72cf, #c8b1e4)',
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
                                                color: activeStep === 0 ? '#496d4b' : activeStep === 1 ? '#006d77' : '#9b72cf',
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
                                    }}>
                                    {activeStep === 0 && (
                                        <TextField
                                            id="outlined-required ResetPasswordEmail"
                                            label="Email address"
                                            variant="outlined"

                                            fullWidth

                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}

                                            error={validationError.email}
                                            helperText={validationError.email}

                                            sx={{ maxWidth: '300px' }}
                                        />
                                    )}

                                    {activeStep === 1 && (
                                        <>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'end',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    width: { xs: '100%', sm: '40ch', md: '50ch' },
                                                    mt: 1,
                                                    mb: 1,
                                                }}>
                                                    <Typography variant="body2" color="textSecondary"
                                                        onClick={sendResetCode}
                                                        sx={{
                                                            background: 'linear-gradient(to right, #006d77, #83c5be, #006d77)',
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            marginRight: { md: '20%', sm: '15%', xs: '5%' },
                                                            cursor: 'pointer',
                                                            fontSize: '1rem',
                                                            '&:hover': {
                                                                boxShadow: '0 2px 0 rgba(0, 109, 119, 0.5)',
                                                            }
                                                        }}
                                                    >
                                                        Send a new code
                                                    </Typography>
                                                </Box>

                                                <div style={{ display: 'inline-block', textAlign: 'center' }}>
                                                    <OtpInput
                                                        value={resetCode}
                                                        onChange={handleChange}
                                                        numInputs={6}
                                                        separator={<span>-</span>}
                                                        renderInput={(props) => (
                                                            <div style={{
                                                                position: 'relative',
                                                                display: 'inline-block',
                                                                margin: !isSmallScreen ? '0 3px' : '0 5px',
                                                            }}>
                                                                <input
                                                                    {...props}
                                                                    style={{
                                                                        position: 'relative',
                                                                        zIndex: 2,
                                                                        width: !isSmallScreen ? '25px' : '35px',
                                                                        height: !isSmallScreen ? '40px' : '50px',
                                                                        margin: '1px',
                                                                        fontSize: '1.5rem',
                                                                        textAlign: 'center',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        padding: '2px',
                                                                        backgroundColor: 'transparent',
                                                                        color: '#000',
                                                                        outline: 'none'
                                                                    }}
                                                                    onFocus={(e) =>
                                                                        (e.target.nextSibling.style.padding = '3px')
                                                                    }
                                                                    onBlur={(e) =>
                                                                        (e.target.nextSibling.style.padding = '2px')
                                                                    }
                                                                />
                                                                <div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        right: 0,
                                                                        bottom: 0,
                                                                        zIndex: 1,
                                                                        borderRadius: '8px',
                                                                        padding: '2px',
                                                                        background: 'linear-gradient(to right, #006d77, #83c5be, #006d77)',
                                                                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                                        WebkitMaskComposite: 'xor',
                                                                        transition: 'background 0.3s ease',
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    />

                                                    {validationError.resetCode && (
                                                        <div style={{
                                                            color: '#d32f2f',
                                                            fontSize: '0.875rem',
                                                            marginTop: '8px',
                                                            textAlign: 'left',
                                                            width: '100%',
                                                            marginLeft: '10px',
                                                        }}>
                                                            {validationError.resetCode}
                                                        </div>
                                                    )}
                                                </div>
                                            </Box>
                                        </>
                                    )}

                                    {activeStep === 2 && (
                                        <>
                                            <TextField
                                                id="outlined-password-input ResetPassword"
                                                label="New Password"
                                                variant="outlined"

                                                type={showPassword ? "text" : "password"}

                                                autoComplete="off"

                                                fullWidth

                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}

                                                error={validationError.password}
                                                helperText={validationError.password}

                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ color: '#c8b1e4', outline: 'none !important' }}>
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}

                                                sx={{
                                                    maxWidth: '300px'
                                                }}
                                            />

                                            <TextField
                                                id="outlined-password-input ResetconfirmationPassword"
                                                label="Confirmation Password"
                                                type={showConfirmationPassword ? "text" : "password"}
                                                autoComplete="off"
                                                variant="outlined"
                                                value={confirmationPassword}
                                                onChange={(e) => setConfirmationPassword(e.target.value)}

                                                fullWidth

                                                error={validationError.confirmationPassword}
                                                helperText={validationError.confirmationPassword}

                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={toggleConfirmationPasswordVisibility} edge="end" sx={{ color: '#c8b1e4', outline: 'none !important' }}>
                                                                {showConfirmationPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}

                                                sx={{
                                                    maxWidth: '300px',
                                                    mt: '0px !important'
                                                }}
                                            />
                                        </>
                                    )}

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end', mt: 2
                                        }}
                                    >
                                        <button className="btn-forgotPass"
                                            onClick={handleNext}
                                            style={{ marginTop: index === 1 ? '0px' : '-15px' }}
                                        >
                                            <svg width="210" height="62">
                                                <defs>
                                                    <linearGradient id="grad1">
                                                        {index === 0 ? (
                                                            <>
                                                                <stop offset="0%" stopColor="#496d4b" />
                                                                <stop offset="50%" stopColor="#a3b18a" />
                                                                <stop offset="100%" stopColor="#496d4b" />
                                                            </>
                                                        ) : index === 1 ? (
                                                            <>
                                                                <stop offset="0%" stopColor="#006d77" />
                                                                <stop offset="50%" stopColor="#83c5be" />
                                                                <stop offset="100%" stopColor="#006d77" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <stop offset="0%" stopColor="#c8b1e4" />
                                                                <stop offset="50%" stopColor="#9b72cf" />
                                                                <stop offset="100%" stopColor="#c8b1e4" />
                                                            </>
                                                        )}
                                                    </linearGradient>
                                                </defs>
                                                <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad1)" width="200" height="50"></rect>
                                            </svg>
                                            <span style={{
                                                background: activeStep === 0 ? 'linear-gradient(to right, #496d4b, #a3b18a,#496d4b)' : activeStep === 1 ? 'linear-gradient(to right, #006d77, #83c5be)' : 'linear-gradient(to right,#c8b1e4,  #9b72cf, #c8b1e4)',
                                                webkitBackgroundClip: 'text',
                                                webkitTextFillColor: 'transparent'
                                            }}>
                                                {index === steps.length - 1
                                                    ? 'Reset Password'
                                                    : index === 1
                                                        ? 'Verify'
                                                        : 'Send Code'}
                                            </span>
                                        </button>
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
                                                width: '90%',

                                                whiteSpace: "pre-wrap",
                                                wordWrap: "break-word",
                                                textAlign: 'left',

                                                backgroundColor: '#f0f8f4',
                                                boxShadow: '0 0 20px 10px #f0f8f4',
                                            }}>

                                            {
                                                error.map((msg, index) => (
                                                    <div key={index}>
                                                        {msg}
                                                    </div>
                                                ))
                                            }
                                        </Alert>
                                    )}
                                </Box>
                            </StepContent>
                        </Step>
                    ))}

                    {activeStep === steps.length && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            width: { xs: '30ch', sm: '30ch', md: '30ch' },
                            mt: 3,
                        }}>
                            <Typography >
                                Password reset successfully !
                            </Typography>
                            <Typography
                                onClick={() => navigate("/login")}
                                sx={{
                                    width: 'fit-content',
                                    background: 'linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9, #9b72cf, #c8b1e4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        textShadow: '0px 0px 10px #c8b1e4 , 0px 0px 10px #c8b1e4',
                                    }
                                }}>
                                click here to log in
                            </Typography>
                        </Box>
                    )}
                </Stepper>
            </Box>
        </Box >
    );
}

export default ForgotPasswordPage;