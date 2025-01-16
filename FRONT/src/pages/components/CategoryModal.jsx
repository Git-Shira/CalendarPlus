// Import React and React hooks
import React, { useState, useEffect } from 'react';

// Import third-party libraries
import axios from 'axios';
import Modal from 'react-modal';

// Import styling assets
import { Box, TextField, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CategoryModal = (props) => {
    const port = import.meta.env.VITE_PORT;

    const [category, setCategory] = useState({
        name: props.selectedCategory.name,
        color: props.selectedCategory.color
    });

    useEffect(() => {
        setCategory({
            name: props.selectedCategory.name,
            color: props.selectedCategory.color
        });
    }, [props.selectedCategory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const editCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${port}/categories/update-category/${props.selectedCategory._id}`,
                category, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log("Category updated successfully");
                props.getCategories();
                props.onClose();
                setCategory({
                    name: '',
                    color: '',
                });
            }

        } catch (error) {
            if (error.response.status === 401)
                console.error("Access denied. No token provided.");

            if (error.response.status === 404)
                console.error("User does not exist");

            if (error.response.status === 400)
                console.error("Category does not exist");

            if (error.response.status === 500)
                console.error("Something went wrong");

            console.error(error);
        }
    }

    return (
        <Modal
            isOpen={props.open}
            onRequestClose={props.onClose}

            contentLabel={"Edit Category"}
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
                }
            }}
        >
            <Box
                component="form"
                onSubmit={editCategory}

                sx={{
                    boxShadow: 'inset 0 0 20px 5px rgb(138,158,139,0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 1, md: 2 },
                    maxWidth: { xs: '90vw', md: 500 },
                    margin: 'auto',

                    justifyContent: 'center',
                    alignItems: 'center',

                    padding: { xs: 2, sm: 3 },

                    '& .MuiTextField-root': {
                        m: 0,
                        width: { xs: '90%', sm: '98%' },
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
                            top: '50%',
                            left: '12px',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'transparent',
                            padding: '0 4px',
                            transition: 'all 0.3s ease',
                            color: "#496d4b",
                        },

                        '& .MuiInputLabel-shrink': {
                            top: '-8px',
                            transform: 'translateY(0)',
                            backgroundColor: '#fff !important',
                            padding: '0 4px',
                        },

                        '& .Mui-focused.MuiInputLabel-root, :hover .MuiInputLabel-root': {
                            fontWeight: 'bold'
                        },
                    },
                }}
            >
                <IconButton
                    onClick={props.onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'black',
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography
                    variant="h3"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        mt: 2,

                        fontSize: '2.5rem',
                        lineHeight: 1.2,
                        background: 'linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9, #9b72cf, #c8b1e4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',

                        textShadow: '3px 3px 4px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    Edit Category
                </Typography>

                <TextField
                    label="Name"
                    name="name"
                    value={category.name}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                <TextField
                    label="Color"
                    name="color"
                    value={category.color}
                    onChange={handleChange}
                    type='color'
                    fullWidth
                />

                <button className="btn" type="submit"
                    style={{
                        marginTop: '0px',
                        marginBottom: '10px'
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
                    <span>
                        Save Changes
                    </span>
                </button>
            </Box>
        </Modal>
    )
}

export default CategoryModal