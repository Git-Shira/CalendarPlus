// Import React and React hooks
import React, { useEffect, useState, useRef } from 'react';

// Import third-party libraries
import axios from "axios";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

// Import local components
import AddEvent from './AddEvent';
import EventModal from './EventModal';

// Import styling assets
import "../../assets/style/Calendar.css";
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';

// Import utilities from MUI
import { useMediaQuery } from '@mui/material';

const CustomToolbar = ({ label, onNavigate, onView }) => {
    const menuRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const [activeNavigate, setActiveNavigate] = useState(() => {
        return localStorage.getItem('activeNavigate') || 'TODAY';
    });

    const [activeView, setActiveView] = useState(() => {
        return localStorage.getItem('activeView') || 'month';
    });

    useEffect(() => {
        localStorage.setItem('activeNavigate', activeNavigate);
        localStorage.setItem('activeView', activeView);
    }, [activeNavigate, activeView]);

    const handleNavigate = (action) => {
        setActiveNavigate(action);
        onNavigate(action);
    };

    const handleViewChange = (view) => {
        setActiveView(view);
        onView(view);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const currentViewIcon = activeView === 'month'
        ? <CalendarViewMonthIcon />
        : activeView === 'week'
            ? <CalendarViewWeekIcon />
            : <CalendarViewDayIcon />;

    return (
        <div className="rbc-toolbar">

            <div className="toolbar-menu-icon" onClick={toggleMenu}>
                {currentViewIcon}
            </div>

            {menuOpen && (
                <div className="toolbar-dropdown" ref={menuRef}>

                    <button
                        className={activeNavigate === "TODAY" ? "active" : ""}
                        onClick={() => handleNavigate("TODAY")}
                    >
                        Today
                    </button>
                    <button
                        className={activeNavigate === "PREV" ? "active" : ""}
                        onClick={() => handleNavigate("PREV")}
                    >
                        Back
                    </button>
                    <button
                        className={activeNavigate === "NEXT" ? "active" : ""}
                        onClick={() => handleNavigate("NEXT")}
                    >
                        Next
                    </button>

                    <button
                        className={activeView === "month" ? "active" : ""}
                        onClick={() => handleViewChange("month")}
                    >
                        Month
                    </button>
                    <button
                        className={activeView === "week" ? "active" : ""}
                        onClick={() => handleViewChange("week")}
                    >
                        Week
                    </button>
                    <button
                        className={activeView === "day" ? "active" : ""}
                        onClick={() => handleViewChange("day")}
                    >
                        Day
                    </button>
                </div>
            )}

            <span className="rbc-toolbar-label">{label}</span>
        </div>
    );
};

const CalendarComp = (props) => {
    const port = import.meta.env.VITE_PORT;

    const localizer = momentLocalizer(moment);

    const eventStyleGetter = (event) => {
        function getTextColor(backgroundColor) {
            const hex = backgroundColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? 'black' : 'white';
        }

        const style = {
            backgroundColor: event.category?.color?.trim()
                ? event.category.color
                : event.color?.trim()
                    ? event.color
                    : '#83c5be',

            borderRadius: '4px',
            opacity: 0.8,
            color: getTextColor(
                event.category?.color?.trim()
                    ? event.category.color
                    : event.color?.trim()
                        ? event.color
                        : '#83c5be'),
            border: 'none',
        };
        return {
            style
        };
    };

    const isSmallScreenMax857 = useMediaQuery('(max-width: 857px)');
    const isSmallScreenMax997 = useMediaQuery('(max-width: 997px)');

    const isSmallScreen = isSmallScreenMax857 || (props.open && isSmallScreenMax997);

    const [view, setView] = useState(() => {
        return localStorage.getItem('activeView') || 'month';
    });

    useEffect(() => {
        localStorage.setItem('activeView', view);
    }, [view]);

    const handleViewChange = (newView) => {
        setView(newView);
    };

    const [navigate, setNavigate] = useState(() => {
        return localStorage.getItem('activeNavigate') || 'TODAY';
    });

    useEffect(() => {
        localStorage.setItem('activeNavigate', navigate);
    }, [navigate]);

    const handleNavigateChange = (date, action) => {
        const storedDate = localStorage.getItem('navigateDate');
        const currentDate = new Date(date);
        const currentDateStr = currentDate.toISOString().split('T')[0];

        if (currentDateStr === new Date().toISOString().split('T')[0]) {
            localStorage.setItem('activeNavigate', 'TODAY');
        } else {
            if (!storedDate) {
                localStorage.setItem('navigateDate', currentDateStr);
            } else {
                const prevDate = new Date(storedDate);
                const prevDateStr = prevDate.toISOString().split('T')[0];

                const difference = currentDateStr.localeCompare(prevDateStr);

                if (difference < 0) {
                    localStorage.setItem('activeNavigate', 'PREV');
                } else if (difference > 0) {
                    localStorage.setItem('activeNavigate', 'NEXT');
                }
            }
        }

        setNavigate(action);
        localStorage.setItem('navigateDate', currentDateStr);
    };

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEvent(null);
    };

    const [isAdd, setIsAdd] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleSelectSlot = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setIsAdd(true);
    };

    const closeModalAddEvent = () => {
        setIsAdd(false);
        setSelectedSlot("");
    };

    useEffect(() => {
        props.getEvents();
    }, [])

    const deleteEvent = async () => {
        try {
            const response = await axios.delete(
                `${port}/events/delete-event/${selectedEvent._id}`
                , {
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                console.log("Event deleted successfully");
                closeModal();
                props.getEvents();
            }

        } catch (error) {
            if (error.response.status === 401)
                console.error("Access denied. No token provided.");

            if (error.response.status === 404)
                console.error("User does not exist");

            if (error.response.status === 400)
                console.error("Event does not exist");

            if (error.response.status === 500)
                console.error("Something went wrong");

            console.error(error);
        }

        closeModal();
    }

    return (
        <div className={`calendar-page ${isSmallScreen ? 'small-screen' : ''}`}>
            <Calendar
                localizer={localizer}
                events={props.events}
                startAccessor="start"
                endAccessor="end"
                step={15}
                defaultView='month'
                views={['day', 'week', 'month']}
                view={view}
                onView={handleViewChange}

                navigate={navigate}
                onNavigate={handleNavigateChange}

                showMultiDayTimes={true}
                style={{
                    width: '85%',
                    height: '83vh',
                    margin: '0 auto',
                }}
                components={{
                    month: {
                        header: ({ date }) => <span>{(window.innerWidth <= 790 || (props.open && window.innerWidth <= 965))
                            ? moment(date).format('ddd')
                            : moment(date).format('dddd')
                        }</span>,
                    },
                    toolbar: isSmallScreen ? CustomToolbar : null,
                }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={handleEventClick}
                popup
                selectable
                onSelectSlot={handleSelectSlot}
            />

            {selectedEvent &&
                <EventModal
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                    eventData={selectedEvent}
                    onDeleteEvent={deleteEvent}
                    getEvents={props.getEvents}

                    categories={props.categories}
                    getCategories={props.getCategories}
                />
            }

            <Modal
                isOpen={isAdd}
                onRequestClose={closeModalAddEvent}
                contentLabel="Add Event"
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
                <AddEvent
                    getEvents={props.getEvents}
                    onClose={closeModalAddEvent}
                    selectedSlot={selectedSlot}

                    categories={props.categories}
                    getCategories={props.getCategories}
                />
            </Modal>
        </div>
    )
}

export default CalendarComp