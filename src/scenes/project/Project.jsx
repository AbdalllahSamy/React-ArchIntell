import React from 'react'
import SideBar from 'components/SideBar'
import { Box, useMediaQuery } from "@mui/material";
import Navbar from 'scenes/navbar';
import {
    ThemeProvider,
    createTheme,
    styled,
    useTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet } from "react-router-dom";
import TopBar from 'components/TopBar';



const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export const Project = () => {
    const [open, setOpen] = React.useState(false);
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const [mode, setMode] = React.useState(
        Boolean(localStorage.getItem("currentMode"))
            ? localStorage.getItem("currentMode")
            : "light"
    );


    return (
        <>
            {/* <Box>
                <Navbar />
            </Box> */}
            <Box sx={{ display: "flex", paddingRight: "6rem",paddingLeft: "2rem", paddingTop: "2rem" }}>
                <CssBaseline />
                <TopBar
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    setMode={setMode}
                />
                {/* <Navbar /> */}

                <SideBar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />

                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    <Outlet />
                </Box>
            </Box>
        </>
    )
}
