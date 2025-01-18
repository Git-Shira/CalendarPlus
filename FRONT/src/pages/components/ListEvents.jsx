// Import React and React hooks
import React, { useState } from 'react';

// Import local components
import EventModal from './EventModal';

// Import styling assets from MUI
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Chip, TablePagination } from '@mui/material';

const ListEvents = (props) => {
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

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedEvents = [...props.events].sort((a, b) => {
        if (orderBy === 'start' || orderBy === 'end') {
            return (new Date(a[orderBy]) - new Date(b[orderBy])) * (order === 'asc' ? 1 : -1);
        }
        if (orderBy === 'category') {
            const categoryA = a.category ? a.category.name : '';
            const categoryB = b.category ? b.category.name : '';
            return categoryA.localeCompare(categoryB) * (order === 'asc' ? 1 : -1);
        }
        return a[orderBy].localeCompare(b[orderBy]) * (order === 'asc' ? 1 : -1);

    });

    const renderStatusChip = (status) => {
        const getColor = (status) => {
            if (status === "Past") return "#496d4b";
            if (status === "Today") return "#9b72cf";
            if (status === "Upcoming") return "#006d77";
            return "#6c757d";
        };

        return (
            <Chip
                label={status}
                style={{
                    backgroundColor: "#fff",
                    color: getColor(status),
                    border: `1px solid ${getColor(status)}`,
                }}
                variant="outlined"
                size="small"
            />
        );
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                My Events
            </Typography>

            <Paper sx={{
                width: "85%",
                boxShadow: 'inset 0 0 20px 5px rgb(138,158,139,0.8)',
                padding: 3,
                borderRadius: '12px',
            }}>
                <TableContainer>
                    <Table
                        sx={{
                            width: '96%',
                            margin: '0 auto',
                            marginBottom: '5px',
                        }}>
                        <TableHead
                            sx={{
                                boxShadow: 'inset 0 0 20px 1px rgb(0,158,153,0.3)',
                                borderRadius: '8px',
                            }}
                        >
                            <TableRow
                                sx={{
                                    borderRadius: '8px',
                                    padding: '12px 6px',
                                    margin: '8px 0',
                                    boxShadow: '0 2px 6px rgba(155, 114, 207, 0.3)',
                                }}>
                                {['color', 'title', 'start', 'end', 'location', 'description', 'category', 'status'].map((column) => (
                                    <TableCell key={column}
                                        sx={{
                                            border: 'none',
                                            color: '#006d77',
                                            fontSize: '1.1rem',
                                            fontWeight: 400,
                                            '& :hover, .Mui-active, .Mui-active .MuiTableSortLabel-icon': {
                                                color: '#009e99 !important',
                                            },
                                        }}
                                    >
                                        <TableSortLabel
                                            active={orderBy === column}
                                            direction={orderBy === column ? order : 'asc'}
                                            onClick={() => handleRequestSort(column)}
                                        >
                                            {column.charAt(0).toUpperCase() + column.slice(1)}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedEvents
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((event) => (
                                    <TableRow
                                        key={event._id}
                                        sx={{
                                            borderRadius: '8px',
                                            padding: '12px 16px',
                                            margin: '8px 0',
                                            boxShadow: 'inset 0 0 5px 1px rgb(155,114,207,0.3)',
                                            transition: 'transform 0.2s',
                                            '&:hover, &:focus': {
                                                cursor: 'pointer',
                                                backgroundColor: 'rgba(200, 177, 228, 0.3)',
                                                boxShadow: '0 0 25px 5px #c8b1e4',
                                            },
                                        }}
                                        onClick={() => handleEventClick(event)}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                    >
                                        <TableCell sx={{ border: 'none', textAlign: 'center', }}>
                                            <div
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    borderRadius: '50%',
                                                    backgroundColor: `${(event.category)
                                                        ? event.category?.color
                                                        : event.color || "white"
                                                        }`,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    border: '2px solid rgba(0, 0, 0, 0.08)',
                                                }}
                                            ></div>
                                        </TableCell>
                                        <TableCell sx={{ border: 'none', textAlign: 'center', }}>    {event.title}</TableCell>
                                        <TableCell sx={{ border: 'none', textAlign: 'center', }}>    {new Date(event.start).toLocaleDateString()}</TableCell>
                                        <TableCell sx={{ border: 'none', textAlign: 'center', }}>    {new Date(event.end).toLocaleDateString()}</TableCell>
                                        <TableCell sx={{ border: 'none', textAlign: 'center', }}>      {event.location ? event.location : '-'}</TableCell>
                                        <TableCell sx={{ border: 'none', textAlign: 'center', }}>    {event.description ? event.description : '-'}</TableCell>
                                        <TableCell sx={{ border: 'none', textAlign: 'center', }}>    {event.category ? event.category.name : '-'}</TableCell>
                                        <TableCell sx={{ border: 'none', textAlign: 'center', }}>    {renderStatusChip(event.status)}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[15, 30, 50]}
                    component="div"
                    count={props.events.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        justifyContent: 'flex-start',
                        color: '#006d77',
                        '& .MuiSelect-icon': {
                            color: '#006d77'
                        },
                        '& .Mui-disabled': {
                            color: '#bfdeda'
                        },
                    }}
                />
            </Paper >

            <EventModal
                isOpen={modalIsOpen}
                onClose={closeModal}
                eventData={selectedEvent}
                getEvents={props.getEvents}
                isEditing={true}
                categories={props.categories}
            />
        </Box>
    );
};

export default ListEvents