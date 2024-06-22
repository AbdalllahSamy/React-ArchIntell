import React, { useState } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, styled, useTheme, Typography, Tooltip, Box } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import FolderCopyOutlined from "@mui/icons-material/FolderCopyOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import axios from "axios";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Array1 = [
  { text: "My Projects", icon: <FolderCopyOutlined />, path: "/projects" },
  { text: "Design Community", icon: <PeopleAltOutlined />, path: "/home" },
  { text: "Settings", icon: <SettingsOutlined />, path: "/settings" },
];

const SideBar = ({ open, handleDrawerClose, handleDrawerOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));

  const [image, setImage] = useState(user.image);

  const handleImageChange = async (event) => {
    const token = await localStorage.getItem('token');
    const file = event.target.files[0];
    const userId = user._id ? user._id : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const uploadProfilePhotoMutation = `
  mutation uploadProfilePhoto($userId: ID!, $photo: String!) {
    uploadProfilePhoto(userId: $userId, photo: $photo) {
      _id
      username
      email
      image
      createdDesigns {
        _id
      }
    }
  }
`;
        const variables = {
          userId: userId,
          photo: file.name
        };

        const payload = {
          query: uploadProfilePhotoMutation,
          variables: variables
        };

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        try {
          const response = await axios.post('http://localhost:9595/graphql', payload, { headers: headers });
          console.log('Response:', response.data.data.uploadProfilePhoto);
          setImage(reader.result);
          localStorage.setItem('user', JSON.stringify(response.data.data.uploadProfilePhoto))
        } catch (error) {
          console.log(error);
        }
        // Optionally, save the image to localStorage or update the user state
        // user.image = reader.result;
        // localStorage.setItem('user', JSON.stringify(user));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={!open ? handleDrawerOpen : handleDrawerClose}>
          {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <Box
        sx={{
          position: 'relative',
          mx: "auto",
          width: open ? 88 : 44,
          height: open ? 88 : 44,
          my: 1,
        }}
      >
        <Avatar
          sx={{
            width: "100%",
            height: "100%",
            transition: "0.25s",
            cursor: "pointer"
          }}
          alt="Profile"
          src={image}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </Box>
      <Typography
        align="center"
        sx={{ fontSize: open ? 17 : 0, transition: "0.25s" }}
      >
        {user.username}
      </Typography>
      <Typography
        align="center"
        sx={{
          fontSize: open ? 15 : 0,
          transition: "0.25s",
          color: theme.palette.info.main,
        }}
      >
        {user.email}
      </Typography>

      <Divider />

      <List>
        {Array1.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
            <Tooltip title={open ? null : item.text} placement="left">
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  bgcolor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[800]
                        : grey[300]
                      : null,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;