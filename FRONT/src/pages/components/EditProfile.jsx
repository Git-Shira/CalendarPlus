// Import React and React hooks
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import third-party libraries
import axios from 'axios';
import Modal from 'react-modal';

// Import styling assets from MUI
import { Box, TextField, Typography, Alert, IconButton, InputAdornment, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

// Import local files
import '../../assets/style/Profile.css';

const EditProfile = (props) => {
    const port = import.meta.env.VITE_PORT;

    const navigate = useNavigate();

    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const [profileDetails, setProfileDetails] = useState({
        name: props.user.name,
        email: props.user.email,
        password: '',
    });

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setProfileDetails({ ...profileDetails, [name]: value });
    };

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [validationError, setValidationError] = useState({});
   
    const validate = () => {
        const error = {};
        if (profileDetails.name && !/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(profileDetails.name)) {
            error.name = "Please enter a valid full name without leading or trailing spaces";
        }
        if (profileDetails.email && !/\S+@\S+\.\S+/.test(profileDetails.email)) {
            error.email = "Invalid email address";
        }
        if (profileDetails.password && profileDetails.password.length < 8) {
            error.password = "The password must be at least 8 characters long";
        }

        setValidationError(error);
        return Object.keys(error).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                const response = await axios.put(
                    `${port}/auth/update`,
                    profileDetails, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    console.log("User updated successfully");
                    setSuccess("User updated successfully");

                    props.getUser();
                }

            } catch (error) {
                if (error.response.status === 401) {
                    console.error("Access denied. No token provided.");
                    setError("Access denied. No token provided.");;
                }
                if (error.response.status === 400) {
                    console.error("User not found");
                    setError("User not found");
                }

                if (error.response.status === 402) {
                    console.error("Email already exists");
                    setError("Email already exists");
                }
                if (error.response.status === 500) {
                    console.error("Something went wrong");
                    setError("Something went wrong");
                }

                console.error("Error updating user:", error);
                alert("Failed to update user");
            }
        }
    };

    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const deleteAcount = async () => {
        try {
            const response = await axios.delete(
                `${port}/auth/delete`,
                {
                    withCredentials: true
                });

            if (response.status === 200) {
                console.log(response.data.message);
                navigate("/login");
            }

        } catch (error) {
            if (error.response.status === 401)
                console.error("Access denied. No token provided.");

            if (error.response.status === 400)
                console.error("User not found");

            if (error.response.status === 500)
                console.error("Something went wrong");

            console.error(error);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
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

                    textShadow: '3px 3px 4px rgba(0, 0, 0, 0.3)',
                }}
            >
                Edit Profile
            </Typography>

            <Accordion
                expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
                sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',

                    boxShadow: 'inset 0 0 20px 5px rgb(138,158,139,0.8)',

                    '&:not(:last-child)': {
                        borderBottom: 0,
                    },
                    '&::before': {
                        display: 'none',
                    },
                    '&.Mui-expanded': {
                        margin: '0 auto',
                    },
                    width: { xs: '90vw', sm: 500 },

                    margin: 'auto',
                    padding: { xs: 1, sm: 2 },

                }}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header"
                    expandIcon={<ArrowForwardIosSharpIcon sx={{
                        fontSize: '0.9rem',
                        marginRight: expanded === 'panel1' ? '5px' : '0px',

                    }} />}

                    sx={{
                        flexDirection: 'row-reverse',
                        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                            transform: 'rotate(90deg)',
                        },
                        '& .MuiAccordionSummary-content': {
                            marginLeft: 1,
                        },
                        marginBottom: '0',
                    }}
                >
                    <Typography>Edit Profile</Typography>
                </AccordionSummary>

                <AccordionDetails
                    sx={{
                        padding: 2,
                        borderTop: '1px solid rgba(73, 109, 75, .5)',
                    }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}

                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 1, sm: 2 },
                            maxWidth: { xs: '90vw', sm: 500 },
                            padding: { xs: 1, sm: 2 },
                            margin: 'auto',

                            justifyContent: 'center',
                            alignItems: 'center',

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
                                    backgroundColor: '#fff',
                                    padding: '0 4px',
                                },
                                '& .Mui-focused.MuiInputLabel-root, :hover .MuiInputLabel-root': {
                                    fontWeight: 'bold'
                                },
                            },

                            '& input:-webkit-autofill': {
                                WebkitBoxShadow: '0 0 0 100px #fff inset !important',
                            },
                        }}
                    >
                        <TextField
                            id="outlined-required EditProfileName"
                            label="Name"
                            name="name"
                            variant="outlined"

                            value={profileDetails.name}
                            onChange={handleChangeInput}

                            error={validationError.name}
                            helperText={validationError.name}
                        />

                        <TextField
                            id="outlined-required EditProfileEmail"
                            label="Email address"
                            name="email"
                            variant="outlined"

                            value={profileDetails.email}
                            onChange={handleChangeInput}

                            error={validationError.email}
                            helperText={validationError.email}
                        />

                        <TextField
                            id="outlined-password-input EditProfilePassword"
                            label="Password"
                            name="password"
                            variant="outlined"

                            type={showPassword ? "text" : "password"}
                            autoComplete="off"
                            value={profileDetails.password}
                            onChange={handleChangeInput}

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
                        />

                        <button className="btn"
                            type="submit"

                            style={{ 
                                marginTop: 0
                             }}
                        >
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
                            <span >
                                Update
                            </span>
                        </button>

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
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}
                sx={{
                    border: '1px solid rgba(0, 0, 0, 0.12)',

                    boxShadow: 'inset 0 0 20px 5px rgb(138,158,139,0.8)',

                    '&:not(:last-child)': {
                        borderBottom: 0,
                    },
                    '&::before': {
                        display: 'none',
                    },
                    '&.Mui-expanded': {
                        margin: '0 auto',
                    },
                    width: { xs: '90vw', sm: 500 },

                    margin: 'auto',
                    padding: { xs: 1, sm: 2 },
                }}
            >
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header"
                    expandIcon={<ArrowForwardIosSharpIcon sx={{
                        fontSize: '0.9rem',
                        marginRight: expanded === 'panel2' ? '5px' : '0px',
                    }} />}

                    sx={{
                        flexDirection: 'row-reverse',
                        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                            transform: 'rotate(90deg)',
                        },
                        '& .MuiAccordionSummary-content': {
                            marginLeft: 1,
                        },
                        marginBottom: '0',
                    }}>
                    <Typography>Delete Profile</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{
                    padding: 2,
                    borderTop: '1px solid rgba(73, 109, 75, .5)',
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 1, sm: 2 },
                            maxWidth: { xs: '90vw', sm: 500 },
                            padding: { xs: 1, sm: 2 },
                            margin: 'auto',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                textAlign: 'start',
                            }}>
                            This action is permanent. Please make sure you're sure before deleting your account.
                        </Typography>

                        <button className="btn danger-btn"
                            type="button"
                            onClick={openModal}
                            style={{
                                marginTop: 0, marginLeft: 'auto',
                                width: '200px', height: '40px',
                                fontSize: '16px', lineHeight: '35px',
                            }}
                        >
                            <svg width="200" height="52">
                                <defs>
                                    <linearGradient id="grad2">

                                        <stop offset="0%" stop-color="#d32f2f" />
                                        <stop offset="25%" stop-color="#e07e7e" />
                                        <stop offset="50%" stop-color="#d32f2f" />
                                        <stop offset="75%" stop-color="#e07e7e" />
                                        <stop offset="100%" stop-color="#d32f2f" />

                                    </linearGradient>
                                </defs>
                                <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad2)" width="190" height="40" style={{ strokeWidth: 2 }}></rect>
                            </svg>
                            <span>
                                Delete Account
                            </span>
                        </button>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Delete Account"
                style={{
                    content: {
                        padding: 0,
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '12px',
                        overflowY: 'auto',
                        maxHeight: '98vh',
                        boxShadow: 'inset 0 0 20px 5px #d32f2f',
                    }
                }}
            >
                <IconButton
                    onClick={closeModal}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'black',
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1, md: 2 },
                        maxWidth: { xs: '90vw', md: 500 },
                        margin: 'auto',
                        padding: 2,
                        marginBottom: 1
                    }}
                >

                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            m: 0,

                            fontSize: '2.5rem',
                            lineHeight: 1.2,

                            background: 'linear-gradient(to right, #d32f2f, #e07e7e , #d32f2f , #e07e7e , #d32f2f )',

                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',

                            textShadow: '3px 3px 4px rgba(0, 0, 0, 0.3)',
                            textAlign: 'center'
                        }}
                    >
                        Delete Account
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 1,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: { xs: '1rem', md: '1.25rem' }
                        }}>
                        Deleting your account is an irreversible action and will erase all your data.
                        <br />
                        Are you sure ?
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 2 }}>
                        <button className="btn modal-btns danger-btn"
                            type="button"
                            onClick={closeModal}
                            style={{
                                marginTop: 0,
                                width: '130px',
                                height: '40px',
                                fontSize: '16px',
                                lineHeight: '35px',
                            }}
                        >
                            <svg width="130" height="52">
                                <defs>
                                    <linearGradient id="grad2">

                                        <stop offset="0%" stop-color="#d32f2f" />
                                        <stop offset="25%" stop-color="#e07e7e" />
                                        <stop offset="50%" stop-color="#d32f2f" />
                                        <stop offset="75%" stop-color="#e07e7e" />
                                        <stop offset="100%" stop-color="#d32f2f" />

                                    </linearGradient>
                                </defs>
                                <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad2)" width="120" height="40" style={{ strokeWidth: 2 }}></rect>
                            </svg>
                            <span>
                                Cancel
                            </span>
                        </button>

                        <button className="btn modal-btns danger-btn"
                            type="button"
                            onClick={deleteAcount}
                            style={{
                                marginTop: 0,
                                width: '130px',
                                height: '40px',
                                fontSize: '16px',
                                lineHeight: '35px',
                            }}
                        >
                            <svg width="130" height="52">
                                <defs>
                                    <linearGradient id="grad3">

                                        <stop offset="0%" stop-color="#d32f2f" />
                                        <stop offset="25%" stop-color="#e07e7e" />
                                        <stop offset="50%" stop-color="#d32f2f" />
                                        <stop offset="75%" stop-color="#e07e7e" />
                                        <stop offset="100%" stop-color="#d32f2f" />

                                    </linearGradient>
                                </defs>
                                <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad3)" width="120" height="40" style={{ strokeWidth: 2 }}></rect>
                            </svg>
                            <span>
                                Delete
                            </span>
                        </button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default EditProfile