import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { Stack, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Card } from './Card'
import { FaPlus } from "react-icons/fa6";


const Dashboard = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [project, setProject] = useState('');
  const navigate = useNavigate();

  const query = `
  query {
    createdDesigns(userId: $userId) {
      _id
      title
      description
      model_type
      outputUrl2D
      outputUrl3D
      creator {
        _id
        username
        email
        image
      }
      comments {
        _id
        comment
        username
        createdAt
      }
      likes {
        id
        createdAt
        username
      }
      createdAt
    }
  }
  `;

  const serverUrl = 'http://localhost:9595/graphql';
  const token = `Bearer ${localStorage.getItem("token")}`;

  useEffect(() => {
    const fetchData = async () => {
      const id = JSON.parse(localStorage.getItem("user"))._id;
      console.log(id);

      try {
        const headers = {
          'Authorization': token,
          'Content-Type': 'application/json'
        };
        const designInput = {
          userId: id
        };

        const variables = {
          userId: designInput
        };
        const payload = {
          query: query,
          variables: variables
        };
        const response = await axios.post(serverUrl, payload, {
          headers: headers
        });
        console.log(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    if (project === '') {
      toast.error("Please enter the project name", {
        position: "top-left"
      });
    } else {
      localStorage.setItem("projectName", project);
      setOpen(false);
      navigate("/Generator");
    }
  };

  const projects = [
    { id: 1, title: "apartment - 3 rooms", timeAgo: "1 hour ago", image: "https://via.placeholder.com/150" },
    { id: 2, title: "Modern Contemporary Living Room", timeAgo: "1 hour ago", image: "https://via.placeholder.com/150" },
    { id: 3, title: "Condo - 1 Bedroom 2", timeAgo: "1 hour ago", image: "https://via.placeholder.com/150" },
    { id: 4, title: "3d floor plan 1", timeAgo: "1 hour ago", image: "https://via.placeholder.com/150" },
    { id: 5, title: "room", timeAgo: "1 hour ago", image: "https://via.placeholder.com/150" },
  ];

  return (
    <div>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Header
            isDashboard={true}
            title={"My Projects"}
            subTitle={"Welcome to your Projects"}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
          <Button sx={{ textTransform: "capitalize" }} className="btn" type="submit" onClick={handleClickOpen}>
            <strong>Create New Project</strong>
            <div id="container-stars">
              <div id="stars" />
            </div>
            <div id="glow">
              <div className="circle" />
              <div className="circle" />
            </div>
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>New Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of your new project.
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <TextField
                label="Project Name"
                multiline
                maxRows={4}
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
      <div className="flex flex-wrap justify-center">
        <div className="bg-gray-500 shadow-md rounded-lg p-4 m-4 w-64 flex items-center justify-center cursor-pointer" onClick={handleClickOpen}>
          <div className="text-center">
            <FaPlus className="text-[6rem]" />
          </div>
        </div>
        {projects.map(project => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
