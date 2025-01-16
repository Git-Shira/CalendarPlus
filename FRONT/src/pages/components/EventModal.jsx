// Import React and React hooks
import React, { useState } from 'react';

// Import third-party libraries
import Modal from 'react-modal';
import moment from 'moment';

// Import local files
import "../../assets/style/Calendar.css";
import EditEventForm from './EditEventForm';

// Import styling assets from MUI
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import icons from MUI
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

const EventModal = (props) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div>
            <Modal
                isOpen={props.isOpen}
                onRequestClose={props.onClose}
                contentLabel="Event Details"
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

                        boxShadow: 'inset 0 0 20px 5px rgb(138,158,139,0.8)',
                    }
                }}
            >
                {props.eventData && (
                    (isEditing || props.isEditing)
                        ?
                        <EditEventForm
                            eventData={props.eventData}
                            onCancel={() => {
                                if (props.isEditing) {
                                    props.onClose();
                                } else {
                                    setIsEditing(false);
                                }
                            }}

                            getEvents={props.getEvents}
                            onClose={props.onClose}

                            categories={props.categories}
                            getCategories={props.getCategories}
                        />
                        :
                        <div>
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

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: { xs: 1, md: 1 },
                                    maxWidth: { xs: '90vw', md: 500 },
                                    margin: 'auto',
                                    padding: { xs: 1, md: 2 },
                                    marginBottom: 3,

                                    '& .MuiTypography-body1': {
                                        marginBottom: 1,
                                        display: 'flex',
                                        paddingLeft: 2,
                                        paddingRight: 2,
                                    },

                                    '& .MuiTypography-root span': {
                                        color: "#006d77",
                                        textDecoration: 'underline',
                                        textDecorationColor: '#9b72cf',
                                        margin: '0px 8px 0px 5px',
                                    },

                                    '& .MuiTypography-body1 svg': {
                                        color: '#9b72cf',
                                    },
                                }}
                            >
                                <Typography variant="h5" sx={{
                                    fontWeight: 'bold', mt: 2, marginBottom: 1, textAlign: 'center',
                                    textDecoration: 'underline',
                                    textDecorationStyle: 'wavy',
                                    textDecorationColor: '#9b72cf',
                                }}>
                                    {props.eventData.title}
                                </Typography>

                                <Typography variant="body1">
                                    <HourglassTopRoundedIcon />
                                    <span>
                                        from:
                                    </span>
                                    {moment(props.eventData.start).format('MMMM D, YYYY hh:mm A')}
                                </Typography>

                                <Typography variant="body1" >
                                    <HourglassBottomRoundedIcon />
                                    <span>
                                        to:
                                    </span>
                                    {moment(props.eventData.end).format('MMMM D, YYYY hh:mm A')}
                                </Typography>

                                {props.eventData.location &&
                                    <Typography variant="body1">
                                        <LocationOnOutlinedIcon />
                                        <span>
                                            Location:
                                        </span>
                                        {props.eventData.location}
                                    </Typography>
                                }

                                {props.eventData.description &&
                                    <Typography variant="body1" >
                                        <DescriptionOutlinedIcon />
                                        <span>
                                            Description:
                                        </span>
                                        {props.eventData.description}
                                    </Typography>
                                }

                                {props.eventData.category &&
                                    <Typography variant="body1" >
                                        <BookmarkBorderOutlinedIcon />
                                        <span>
                                            Category:
                                        </span>
                                        {props.eventData.category.name}
                                    </Typography>
                                }

                                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 2 }}>
                                    <button className="btn modal-btns"
                                        type="button"
                                        onClick={() => setIsEditing(true)}
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
                                            <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad1)" width="120" height="40" style={{ strokeWidth: 2 }}></rect>
                                        </svg>
                                        <span>
                                            Edit
                                        </span>
                                    </button>

                                    <button className="btn modal-btns"
                                        type="button"
                                        onClick={props.onDeleteEvent}
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
                                            <rect x="5" y="5" rx="25" fill="none" stroke="url(#grad2)" width="120" height="40" style={{ strokeWidth: 2 }}></rect>
                                        </svg>
                                        <span>
                                            Delete
                                        </span>
                                    </button>
                                </Box>
                            </Box>
                        </div>
                )}
            </Modal>
        </div>
    )
}

export default EventModal