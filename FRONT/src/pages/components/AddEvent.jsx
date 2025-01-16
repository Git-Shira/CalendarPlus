// Import React and React hooks
import React, { useEffect, useState } from 'react';

// Import third-party libraries
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import axios from 'axios';

// Import styling assets
import { InputLabel, TextField, FormControl, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import local files
import colors from '../../assets/colors';

const AddEvent = (props) => {
    const port = import.meta.env.VITE_PORT;

    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        end: '',
        location: '',
        description: '',
        color: '',
        category: ''
    });

    useEffect(() => {
        if (props.selectedSlot) {
            setNewEvent({
                ...newEvent,
                start: moment(props.selectedSlot.start).format("YYYY-MM-DDTHH:mm"),
                end: moment(props.selectedSlot.end).format("YYYY-MM-DDTHH:mm"),
            })
        }
    }, [props.selectedSlot])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventToSubmit = { ...newEvent };

        if (!eventToSubmit.category) {
            delete eventToSubmit.category;
        }

        try {
            const response = await axios.post(
                `${port}/events/new-event`,
                eventToSubmit, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log("Event created successfully");
                // alert(response.data.message);

                setNewEvent({
                    title: '',
                    start: '',
                    end: '',
                    location: '',
                    description: '',
                    color: '',
                    category: ''
                });

                if (props.setActiveComponent) {
                    props.setActiveComponent('Calendar');
                }
                else {
                    props.onClose();
                    props.getEvents();
                }
            }
        } catch (error) {
            if (error.response.status === 401) {
                console.error("Access denied. No token provided.");
            }

            if (error.response.status === 400)
                console.error("User does not exist");

            if (error.response.status === 500)
                console.error("Something went wrong");

            console.error("Error creating event:", error);
            alert("Failed to create event");

        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}

            sx={{
                boxShadow: 'inset 0 0 20px 5px rgb(138,158,139,0.8)',
                borderRadius: '12px',

                background: props.selectedSlot ? 'white' : 'var(--bg) !important',

                gap: { xs: 1, sm: 2 },
                width: { xs: '90vw', sm: 500 },
                margin: 'auto',
                padding: { xs: 2, sm: 3 },

                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',

                '& .MuiTextField-root': {
                    m: 0,
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

                            pointerEvents: 'none',
                        },
                        '&:hover:before': {
                            padding: '3px',
                        },
                        '&.Mui-focused:before': {
                            padding: '3px',
                        },
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
                        backgroundColor: props.selectedSlot ? 'white' : '#f0f8f4 !important',
                        padding: '0 4px',

                    },
                    '& .Mui-focused.MuiInputLabel-root, :hover .MuiInputLabel-root': {
                        fontWeight: 'bold'
                    },
                    '& :not(:hover) .MuiInputLabel-root, .MuiInputLabel-root:hover, .MuiTextField-root.MuiInputLabel-root:not(.Mui-focused)': {
                    },
                },

                "& .custom-date-picker": {
                    width: '100%',
                    fontSize: "16px",
                    height: '56px',
                    padding: '12px',
                    borderRadius: "16px",
                    boxShadow: props.selectedSlot ? 'none' : "inset 0px 0px 20px 50px #f0f8f4",
                    border: '2.5px solid transparent',
                    backgroundImage: `linear-gradient(white, white), 
                      linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9, #9b72cf, #c8b1e4)`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                    "&:focus": {
                        outline: "none",
                        border: '3.5px solid transparent',
                    },
                    "&::placeholder": {
                        color: '#496d4b',
                    },
                },
                "& .react-datepicker-wrapper": {
                    width: "100%",
                },
                "& .react-datepicker__input-container": {
                    width: "100%",
                },
            }}
        >
            {!props.setActiveComponent &&
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
            }
            <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                    m: 0,
                    mt: -2,
                    mb: -1,
                    fontSize: !props.setActiveComponent ? '2.5rem' : '3.3rem',
                    lineHeight: 1.2,
                    background: 'linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9, #9b72cf, #c8b1e4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '3px 3px 4px rgba(0, 0, 0, 0.3)',
                }}
            >
                Add New Event
            </Typography>

            <TextField
                label="Title"
                name="title"
                value={newEvent.title}
                onChange={handleChange}
                required
                fullWidth
            />

            <FormControl fullWidth>
                <InputLabel
                    shrink={true}

                    sx={{
                        top: { xs: '5px', sm: '3px' },
                        left: '12px',
                        transform: 'translateY(-50%)',
                        backgroundColor: props.selectedSlot ? 'white' : '#f0f8f4',
                        padding: '0 4px',
                        color: "#496d4b",
                        transition: 'all 0.3s ease',
                    }}
                >
                    Start Date *
                </InputLabel>

                <DatePicker
                    selected={newEvent.start ? new Date(newEvent.start) : null}
                    onChange={(date) => handleChange({
                        target: {
                            name: 'start',
                            value: date ? new Date(date) : null,
                        },
                    })}
                    showTimeSelect
                    dateFormat="HH:mm dd/MM/yyyy"
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    placeholderText="dd/mm/yyyy  --:--"
                    className="custom-date-picker"
                />
            </FormControl>

            <FormControl fullWidth>
                <InputLabel
                    shrink={true}

                    sx={{
                        top: { xs: '5px', sm: '3px' },
                        left: '12px',
                        transform: 'translateY(-50%)',
                        backgroundColor: props.selectedSlot ? 'white' : '#f0f8f4',
                        padding: '0 4px',
                        color: "#496d4b",
                        transition: 'all 0.3s ease',
                    }}
                >
                    End Date
                </InputLabel>

                <DatePicker
                    selected={newEvent.end ? new Date(newEvent.end) : null}
                    onChange={(date) => handleChange({
                        target: {
                            name: 'end',
                            value: date ? new Date(date) : null,
                        },
                    })}

                    showTimeSelect
                    dateFormat="HH:mm dd/MM/yyyy"
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    placeholderText="dd/mm/yyyy  --:--"
                    className="custom-date-picker"
                />
            </FormControl>

            <TextField
                label="Location"
                name="location"
                value={newEvent.location}
                onChange={handleChange}
                fullWidth
            />

            <TextField
                label="Description"
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                multiline
                rows={2}

                fullWidth

                sx={{
                    '& .MuiOutlinedInput-root': {
                        position: 'relative',
                        '& textarea': {
                            resize: 'vertical',
                            overflow: 'auto',
                            zIndex: 1,
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#c8b1e4',
                                borderRadius: '18px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: '#9b72cf',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'rgba(200, 177, 228, 0.5)',
                            },
                        },
                    },
                }}
            />

            <FormControl component="fieldset" sx={{
                mt: -1,
                width: { xs: props.selectedSlot ? '94%' : '96%', sm: '98%' },
            }}>
                <Typography variant="subtitle1" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
                    Choose Color
                </Typography>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gridTemplateRows: 'auto auto',
                    gap: { xs: 0.5, sm: 1 },
                    maxWidth: 'calc(10 * 32px + 9 * 8px)',
                    mt: 0,

                }}>
                    {colors.map((color) => (
                        <Box
                            key={color.name}
                            onClick={() => handleChange({ target: { name: 'color', value: color.value } })}
                            sx={{

                                minWidth: '20px',
                                maxWidth: '32px',

                                aspectRatio: 1,

                                backgroundColor: color.value,
                                borderRadius: '50%',
                                cursor: 'pointer',
                                border: newEvent.color === color.value ? '3px solid #000' : '2px solid transparent',
                                transition: 'border 0.3s',
                            }}
                        />
                    ))}
                </Box>
            </FormControl>

            {props.categories.length > 0 && (
                <FormControl fullWidth sx={{
                    mt: -1,
                    width: { xs: props.selectedSlot ? '94%' : '96%', sm: '98%' },
                }}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
                        Category
                    </Typography>
                    <Select
                        value={newEvent.category
                            ? { value: newEvent.category, label: props.categories.find(category => category._id === newEvent.category)?.name || 'Select Category' }
                            : { value: '', label: 'Select Category' }}
                        onChange={(selectedOption) => handleChange({ target: { name: 'category', value: selectedOption.value } })}

                        options={[
                            { value: '', label: 'None' },
                            ...props.categories.map(category => ({
                                value: category._id,
                                label: category.name,
                            })),
                        ]}
                        getOptionLabel={(e) => e.label}
                        getOptionValue={(e) => e.value}
                        placeholder="Select Category"

                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                backgroundColor: props.selectedSlot ? 'none' : '#f0f8f4',

                                borderImageSource: 'linear-gradient(to right, #496d4b, #a3b18a, #006d77, #83c5be, #1d8ea9, #89c2d9, #9b72cf, #c8b1e4)',
                                borderImageSlice: 1,
                                boxShadow: state.isFocused
                                    ? '0 0 0 2px rgba(0, 109, 119, 0.5)'
                                    : 'none',
                            }),
                            menu: (provided) => ({
                                ...provided,
                                backgroundColor: '#fff',
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected
                                    ? '#bfdeda'
                                    : state.isFocused
                                        ? '#d5eae7'
                                        : 'transparent',
                                '&:active': {
                                    backgroundColor: '#bfdeda',
                                },
                            }),
                            dropdownIndicator: (provided, state) => ({
                                ...provided,
                                color: state.isFocused ? '#006d77' : '#bfdeda',
                                '&:hover': { color: '#006d77', cursor: 'pointer' },
                            }),
                            indicatorSeparator: (provided) => ({
                                ...provided,
                                backgroundColor: '#006d77',
                            }),
                        }}
                        menuPlacement="auto"

                        classNamePrefix="custom-select"
                    />
                </FormControl>
            )}

            <button className="btn" type="submit"
                style={{
                    marginTop: '0px'
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
                    Add New Event
                </span>
            </button>
        </Box>
    );
};

export default AddEvent;