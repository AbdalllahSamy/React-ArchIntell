import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { Landing } from "components/Landing/Landing";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { Project } from "scenes/project/Project";
import CardDetails  from "scenes/homePage/CardDetails";
import Dashboard from "scenes/dashboard/Dashboard";
import Generator from "scenes/Generator/Generator";
import "react-toastify/dist/ReactToastify.css";
import EditePage from "scenes/editepage/EditePage";


function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/Generator"
              element={isAuth ? <Generator /> : <Navigate to="/login" />}
            />
            <Route
              path="/projects"
              element={isAuth ? <Project /> : <Navigate to="/login" />}
            >
              <Route index element={<Dashboard />} />
              <Route path="EditePage" element={<EditePage />} />
            </Route>
            <Route path="/post/:postId" element={<CardDetails />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
