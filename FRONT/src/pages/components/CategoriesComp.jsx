// Import React and React hooks
import React, { useState } from 'react';

// Import MUI components and utilities
import { TextField, IconButton, Typography, Alert, Box } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

// Import MUI icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

// Import third-party libraries
import axios from 'axios';

// Import local components
import CategoryModal from './CategoryModal';

const CategoriesComp = (props) => {
    const port = import.meta.env.VITE_PORT;

    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const [selectedCategory, setSelectedCategory] = useState({
        name: '',
        color: ''
    });
    const [open, setOpen] = useState(false);

    const openModalEditCategory = (category) => {
        setSelectedCategory(category);
        setOpen(true);
    };

    const closeModalCategory = () => {
        setOpen(false);
        setSelectedCategory({
            name: '',
            color: ''
        });
    };

    const [newCategory, setNewCategory] = useState({
        name: '',
        color: ''
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const addCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${port}/categories/new-category`,
                newCategory, {
                withCredentials: true
            });

            if (response.status === 200) {
                setError("");
                setSuccess("Category created successfully");
                console.log("Category created successfully");
                props.getCategories();

                setTimeout(() => {
                    setSuccess("");
                    setNewCategory({
                        name: '',
                        color: '',
                    });
                    setExpanded('panel2');
                }, 2000);
            }

        } catch (error) {
            setSuccess("");

            if (error.response.status === 401) {
                setError("Access denied. No token provided.");
                console.error("Access denied. No token provided.");
            }

            if (error.response.status === 400) {
                setError("Category with this name already exists for this user");
                console.error("Category with this name already exists for this user");
            }

            if (error.response.status === 500) {
                setError("An error occurred while creating the category");
                console.error("An error occurred while creating the category");
            }

            console.error("Error creating category:", error);
            alert("Failed to create category");
        }
    };

    const deleteCategory = async (id) => {

        try {
            const response = await axios.delete(
                `${port}/categories/delete-category/${id}`,
                {
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                console.log("Category deleted successfully");
                props.getCategories();
            }

        } catch (error) {

            if (error.response.status === 401)
                console.error("Access denied. No token provided.");

            if (error.response.status === 400)
                console.error("Category not found");

            if (error.response.status === 500)
                console.error("An error occurred while deleting the category");

            console.error(error);
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: expanded === 'panel2' ? 1 : 0,
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
                My Categories
            </Typography>

            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
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
                    }}>
                    <Typography>Add Category</Typography>
                </AccordionSummary>

                <AccordionDetails
                    sx={{
                        padding: 2,
                        borderTop: '1px solid rgba(73, 109, 75, .5)',
                    }}>
                    <Box
                        component="form"
                        onSubmit={addCategory}

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
                                    backgroundColor: '#fff !important',
                                    padding: '0 4px',
                                },

                                '& .Mui-focused.MuiInputLabel-root, :hover .MuiInputLabel-root': {
                                    fontWeight: 'bold'
                                },

                            },
                        }}
                    >

                        <TextField
                            id="outlined-required AddCategoryName"
                            label="Name"
                            name="name"
                            variant="outlined"

                            required

                            value={newCategory.name}
                            onChange={handleChangeInput}
                        />

                        <TextField
                            id="outlined-required AddCategoryColor"
                            label="Color"
                            name="color"
                            value={newCategory.color}
                            onChange={handleChangeInput}
                            type='color'

                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
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
                            <span>
                                Add New Category
                            </span>
                        </button>

                        {success && (
                            <Alert
                                variant="outlined"
                                severity="success"
                                sx={{
                                    mt: 2,
                                    width: { xs: '90%', sm: '40ch' },
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
                    <Typography>My Categories</Typography>
                </AccordionSummary>

                <AccordionDetails
                    sx={{
                        padding: 2,
                        borderTop: '1px solid rgba(73, 109, 75, .5)',
                    }}
                >
                    <List sx={{ width: '100%', maxWidth: 400, padding: '0 32px' }}>
                        {props.categories.map((category) => (
                            <ListItem
                                key={category._id}
                                sx={{
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    margin: '8px 0',

                                    boxShadow: 'inset 0 0 20px 1px rgb(0,158,153,0.3)',

                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        boxShadow: '0 0 25px 5px #c8b1e4',
                                        backgroundColor: 'rgba(200, 177, 228, 0.3)',
                                        '& .MuiIconButton-root': {
                                            color: '#9b72cf',
                                        },
                                    }
                                }}

                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}

                                secondaryAction={
                                    <>
                                        <IconButton size="small" sx={{ marginRight: '4px', color: "#009e99" }} onClick={() =>
                                            openModalEditCategory(category)
                                        }>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" sx={{ color: "#009e99" }} onClick={() => deleteCategory(category._id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemAvatar>
                                    <div
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            backgroundColor: category.color || 'white',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            border: '2px solid rgba(0, 0, 0, 0.08)',
                                        }}
                                    >
                                    </div>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={category.name}
                                    primaryTypographyProps={{ fontWeight: 'bold', color: '#333' }}
                                />
                            </ListItem>
                        ))}
                    </List>

                </AccordionDetails>
            </Accordion>

            <CategoryModal open={open} onClose={closeModalCategory} selectedCategory={selectedCategory} getCategories={props.getCategories} />
        </Box>
    );
};

export default CategoriesComp;