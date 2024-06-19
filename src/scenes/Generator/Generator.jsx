
import { Button, Stack, useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import Header from "../../components/Header";
import MenuItem from '@mui/material/MenuItem';
import { useForm } from "react-hook-form";
import React from "react";
import SideBar from "components/SideBar";
import Navbar from "scenes/navbar";
import localStorage from "redux-persist/es/storage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopBar from '../../components/TopBar';
import { useState } from "react";
import { ZoomedImage } from "./ZoomedImage";
// import M1 from ""



const Generator = () => {
  // const theme = useTheme();
  const navigate = useNavigate();
  const localToken = localStorage.getItem("token");
  const [token, setToken] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const project = localStorage.getItem("projectName");
  const [projectName, setProjectName] = React.useState("");
  if (project instanceof Promise) {
    project.then(value => {
      setProjectName(value);
    }).catch(error => {
      setProjectName("");
    });
  } else {
    // If not a Promise, log the value directly
    setProjectName(project);
  }
  if (localToken instanceof Promise) {
    localToken.then(value => {
      setToken(value);
    }).catch(error => {
      setToken("");
    });
  } else {
    // If not a Promise, log the value directly
    setToken(project);
  }
  const [model, setModel] = React.useState("2D");
  const [description, setDescription] = React.useState("");
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleImageClick = (image) => {
    setZoomedImage(image);
  };


  const handleCloseZoom = () => {
    setZoomedImage(null);
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const mutation = `
  mutation CreateDesign($designInput: DesignInput!) {
    createDesign(designInput: $designInput) {
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

  const onSubmit = async () => {
    try {
      const designInput = {
        model_type: model,
        title: projectName,
        description: description
      };
      const variables = {
        designInput: designInput
      };
      const payload = {
        query: mutation,
        variables: variables
      };
      console.log(token);

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(serverUrl, payload, {
        headers: headers
      });
      if (response) {
        console.log(response);
        // navigate("/projects");
      }
    } catch (error) {
      console.log("something went wrong");
    }

  }
  const currencies = [
    {
      value: '2D',
      label: '2D',
    },
    {
      value: '3D',
      label: '3D',
    }
  ];


  const [mode, setMode] = React.useState(
    Boolean(localStorage.getItem("currentMode"))
      ? localStorage.getItem("currentMode")
      : "light"
  );
  return (
    <>
      <Box>
        <Navbar />
      </Box>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          paddingTop: "1.5rem",
          paddingLeft: "7rem",
          paddingRight: "7rem",
        }}
        noValidate
        autoComplete="off"
      >


        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Header
            isDashboard={true}
            title={"Your Project Name : " + projectName}
            subTitle={"Welcome to your Projects"}
          />
        </Stack>
        <SideBar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
        <Stack sx={{ gap: 2 }} direction={"row"} >
          <TextField
            sx={{ flex: 2 }}
            // label="Project Name"
            // placeholder="Placeholder"
            multiline
            value={projectName}
            disabled
          />

          <TextField

            sx={{ flex: 2 }}
            select
            label="Model Type"
            // defaultValue="2D"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <TextField
          id="outlined-multiline-static"
          label="Prompt"
          multiline
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box sx={{ textAlign: "right" }}>
          <Button sx={{ textTransform: "capitalize" }} className="btn" type="submit">
            <strong>Generate Image</strong>
            <div id="container-stars">
              <div id="stars" />
            </div>
            <div id="glow">
              <div className="circle" />
              <div className="circle" />
            </div>

          </Button>
          {/* <img src={M1} alt="m1"/> */}

        </Box>


        <div className="flex justify-center relative cursor-pointer" onClick={() => handleImageClick("https://th.bing.com/th/id/R.3ee1f23f777badad3cc9bea698935971?rik=LGFjMsaJaeWAjQ&pid=ImgRaw&r=0")}>
          <img src="https://th.bing.com/th/id/R.3ee1f23f777badad3cc9bea698935971?rik=LGFjMsaJaeWAjQ&pid=ImgRaw&r=0" alt="img" className="w-1/4" />
        </div>
        {zoomedImage && <ZoomedImage src={zoomedImage} onClose={handleCloseZoom} />}


      </Box>
    </>
  );
};

export default Generator;
