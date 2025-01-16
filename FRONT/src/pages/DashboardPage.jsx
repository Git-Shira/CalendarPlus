// Import React and React hooks
import * as React from 'react';
import { useEffect, useState } from 'react';

// Import routing
import { useNavigate } from 'react-router-dom';

// Import styling components from MUI
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMediaQuery } from '@mui/material';

// Import icons from MUI
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventIcon from '@mui/icons-material/Event';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListIcon from '@mui/icons-material/List';
import CategoryIcon from '@mui/icons-material/Category';
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Logout from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';

// Import local components
import Calendar from './components/CalendarComp';
import AddEvent from './components/AddEvent';
import ListEvents from './components/ListEvents';
import Categories from './components/CategoriesComp';
import EditProfile from './components/EditProfile';
import Profile from './components/Profile';

// Import axios for API requests
import axios from "axios";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const DashboardPage = (props) => {
  const port = import.meta.env.VITE_PORT;

  const navigate = useNavigate();

  const theme = useTheme();

  const [open, setOpen] = React.useState(useMediaQuery('(min-width:857px)'));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [activeComponent, setActiveComponent] = React.useState('Calendar');
  const renderComponent = () => {
    switch (activeComponent) {
      case 'AddEvent':
        return <AddEvent setActiveComponent={setActiveComponent} categories={categories} getCategories={getCategories} />;
      case 'List':
        return <ListEvents events={events} getEvents={getEvents} categories={categories} />;
      case 'Categories':
        return <Categories categories={categories} getCategories={getCategories} />;
      case 'Profile':
        return <Profile events={events} categories={categories} />;
      case 'EditProfile':
        return <EditProfile user={props.user} getUser={props.getUser} />;
      case 'Calendar':
      default:
        return <Calendar events={events} getEvents={getEvents} open={open} categories={categories} getCategories={getCategories} />;
    }
  };

  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    try {
      const response = await axios.get(
        `${port}/events/all-events`,
        {
          withCredentials: true
        });

      if (response.status === 200) {
        const formattedEvents = response.data.events.map(event => {
          const today = new Date();
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);

          return {
            ...event,
            start: eventStart,
            end: eventEnd,
            status: eventEnd < today ? 'Past' :
              eventStart <= today && eventEnd >= today ? 'Today' :
                'Upcoming'
          }
        });

        setEvents(formattedEvents);
      }

    } catch (error) {
      if (error.response.status === 401)
        console.error("Access denied. No token provided");

      if (error.response.status === 400)
        console.error("User not found");

      if (error.response.status === 500)
        console.error("Something went wrong");

      console.error(error);
    }
  };

  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${port}/categories/all-categories`,
        {
          withCredentials: true
        });

      if (response.status === 200) {
        setCategories(response.data.categories);
      }

    } catch (error) {
      if (error.response.status === 401)
        console.error("Access denied. No token provided");

      if (error.response.status === 400)
        console.error("No categories found for this user");

      if (error.response.status === 500)
        console.error("Something went wrong");

      console.error(error);
    }
  };

  useEffect(() => {
    getEvents();
    getCategories();
  }, [])

  useEffect(() => {
    props.getUser();
  }, [props.user.name, props.user.email]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {

    try {
      setAnchorEl(null);

      await axios.post(
        `${port}/auth/logout`,
        {},
        {
          withCredentials: true
        });

      console.log("Logged out successfully");
      navigate("/login");

    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      width: '100%',
      marginTop: '25px'
    }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{
        backgroundColor: 'white',
        boxShadow: 'none', color: "black",
        width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
      }}>
        <Toolbar sx={{
          background: 'linear-gradient(to right, rgba(73, 109, 75, 0.6), rgba(131, 197, 190, 0.6), rgba(200, 177, 228, 0.6))',
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <ViewListIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" >
            {props.user.name}'s Calendar
          </Typography>

          <IconButton
            color="inherit"
            aria-haspopup="true"

            onClick={handleMenuClick}

            sx={{
              animation: 'none',
              marginLeft: 'auto',
              '& .MuiSvgIcon-root': {
                fontSize: 32
              },
            }}
          >
            <AccountCircleOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setActiveComponent('Profile')}
          sx={{
            color: '#496d4b',
            '&:hover': {
              backgroundColor: 'rgba(73, 109, 75, 0.2)',
            },
          }}>
          <ListItemIcon sx={{ color: '#496d4b' }}>
            <BarChartIcon fontSize="small" />
          </ListItemIcon>
          Profile Overview
        </MenuItem>

        <MenuItem onClick={() =>
          setActiveComponent('EditProfile')
        }
          sx={{
            color: "#006d77",
            '&:hover': {
              backgroundColor: 'rgba(0, 109, 119, 0.2)',
            },
          }}>
          <ListItemIcon sx={{ color: "#006d77" }}>
            <DriveFileRenameOutlineSharpIcon fontSize="small" />
          </ListItemIcon>
          Edit Profile
        </MenuItem>

        <MenuItem onClick={logout}
          sx={{
            color: "#9b72cf",
            '&:hover': {
              backgroundColor: 'rgba(155, 114, 207, 0.2)',
            },
          }}>
          <ListItemIcon sx={{ color: "#9b72cf" }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Drawer variant="permanent" open={open} sx={{
        display: open ? 'flex' : { xs: 'none', sm: 'flex' },
        '& .MuiDrawer-paper': {
          background: 'linear-gradient(to bottom, rgba(73, 109, 75, 0.6) 0%, rgba(73, 109, 75, 0.6) 10%, rgba(131, 197, 190, 0.6) 60%, rgba(200, 177, 228, 0.6) 100%)'
        },
      }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}
            sx={{
              color: open ? 'rgb(0 0 0 / 54%)' : 'transparent',
            }}
          >
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ display: open ? "flex" : "none" }} />
        <List >
          {[
            { text: 'Calendar', icon: <EventIcon sx={{ color: '#333' }} />, component: 'Calendar' },
            { text: 'Add New Event', icon: <AddCircleIcon sx={{ color: '#333' }} />, component: 'AddEvent' },
            { text: 'My Events', icon: <ListIcon sx={{ color: '#333' }} />, component: 'List' },
            { text: 'My Categories', icon: <CategoryIcon sx={{ color: '#333' }} />, component: 'Categories' },
          ].map(({ text, icon, component }) => (
            <>    <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => {
                  setActiveComponent(component);
                }}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    transition: 'background-color 0.3s ease',
                  },
                  open
                    ? {
                      justifyContent: 'initial',
                    }
                    : {
                      justifyContent: 'center',
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                      borderRadius: '5px 5px',
                      '& .MuiSvgIcon-root': {
                        filter: 'drop-shadow(0px 0px 5px rgba(255, 255, 255, 1)) drop-shadow(0px 0px 5px rgba(255, 255, 255, 1)) drop-shadow(0px 0px 15px rgba(255, 255, 255, 1))',
                      },
                    },
                    open
                      ? {
                        mr: 3,
                      }
                      : {
                        mr: 'auto',
                      },
                  ]}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={
                    [{
                      textShadow: '0px 0px 10px rgba(255, 255, 255, 1), 0px 0px 10px rgba(255, 255, 255, 1), 0px 0px 20px rgba(255, 255, 255, 1)',
                    },
                    open
                      ? {
                        opacity: 1,
                      }
                      : {
                        opacity: 0,
                      },
                    ]}
                />
              </ListItemButton>
            </ListItem>
            </>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{
        flexGrow: 1, p: 0,
        mt: 4,
        pt: 3.5,
        width: open ? `calc(100% - ${drawerWidth}px)` : '100%', background: '#f0f8f4',
      }}>
        {renderComponent()}
      </Box>

    </Box >
  );
}

export default DashboardPage;