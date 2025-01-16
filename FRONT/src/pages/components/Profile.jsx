// Import React and React hooks
import React, { useState, useEffect } from 'react';

// Import styling assets
import '../../assets/style/Profile.css';

// Import styling components from MUI
import { Box, Typography } from '@mui/material';

const Profile = ({ events, categories }) => {
    const [completed, setCompleted] = useState(0);
    const [notCompleted, setNotCompleted] = useState(0);
    const [totalEvents, setTotalEvents] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);

    useEffect(() => {
        const completedEvents = events.filter(event => event.status === "Past");
        const notCompletedEvents = events.length - completedEvents.length;

        let countCompleted = 0;
        let countNotCompleted = 0;
        let countEvents = 0;
        let countCategories = 0;

        const interval = setInterval(() => {
            if (countCompleted < completedEvents.length) {
                countCompleted += 1;
                setCompleted(countCompleted);
            }
            if (countNotCompleted < notCompletedEvents) {
                countNotCompleted += 1;
                setNotCompleted(countNotCompleted);
            }
            if (countEvents < events.length) {
                countEvents += 1;
                setTotalEvents(countEvents);
            }
            if (countCategories < categories.length) {
                countCategories += 1;
                setTotalCategories(countCategories);
            }
            if (countCompleted === completedEvents.length && countNotCompleted === notCompletedEvents && countEvents === events.length && countCategories === categories.length) {
                clearInterval(interval);
            }
        }, 30);
    }, [events, categories]);

    const donutStyle = () => ({
        position: 'relative',
        width: { xs: '150px', sm: '230px' },
        height: { xs: '150px', sm: '230px' },
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    });

    const outerCircleStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'var(--gradient)',
        zIndex: 1,
        animation: 'rotateGradient 1.5s linear infinite',
    };

    const innerCircleStyle = {
        width: { xs: '120px', sm: '175px' },
        height: { xs: '120px', sm: '175px' },
        borderRadius: '50%',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 2,
        fontSize: { xs: '16px', sm: '20px', md: '22px' },
        fontWeight: 'bold',
        textAlign: 'center',
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
                Profile
            </Typography>

            <Box sx={{
                display: 'grid',
                gap: { xs: 2, sm: 2 },
                margin: '0 auto',
                width: { xs: '90%', sm: '90%', md: '60%' },
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                justifyItems: 'center',
                alignItems: 'center',
            }}>
                <Box sx={donutStyle()}>
                    <div style={outerCircleStyle} />
                    <Box sx={innerCircleStyle}>
                        <span>
                            {totalCategories}
                            <br />
                            Categories
                        </span>
                    </Box>
                </Box>

                <Box sx={donutStyle()}>
                    <div style={outerCircleStyle} />
                    <Box sx={innerCircleStyle}>
                        <span>{totalEvents}
                            <br />
                            Events
                        </span>
                    </Box>
                </Box>

                <Box sx={donutStyle()}>
                    <div style={outerCircleStyle} />
                    <Box sx={innerCircleStyle}>
                        <span>{completed}
                            <br />
                            Past Events
                        </span>
                    </Box>
                </Box>

                <Box sx={donutStyle()}>
                    <div style={outerCircleStyle} />
                    <Box sx={innerCircleStyle}>
                        <span>{notCompleted}
                            <br />
                            Today & Future Events
                        </span>
                    </Box>
                </Box>
            </Box >
        </Box>
    );
};

export default Profile;