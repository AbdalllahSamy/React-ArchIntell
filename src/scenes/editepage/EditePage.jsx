import React, { useState, useEffect } from "react";
import { Button, Stack, Box, TextField } from "@mui/material";
import Header from "../../components/Header";
import SideBar from "components/SideBar";
import localStorage from "redux-persist/es/storage";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { ZoomedImage } from "../Generator/ZoomedImage";
import { useForm } from "react-hook-form";

const EditPage = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState(null);
  const [model, setModel] = useState("2D");
  const [description, setDescription] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);

  const searchQuery = `
    query searchDesignId($designId: ID!) {
      searchDesignId(designId: $designId) {
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

  useEffect(() => {
    const fetchProjectData = async () => {
      const tokenPromise = localStorage.getItem('token');
      const token = await tokenPromise;
      console.log(token);
      const payload = {
        query: searchQuery,
        variables: {
          designId: id, // Use the project ID from the URL
        },
      };

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      try {
        const response = await axios.post('http://localhost:9595/graphql', payload, { headers });
        const transformedDesign = {
          ...response.data.data.searchDesignId,
          image: response.data.data.searchDesignId.outputUrl3D ? `data:image/png;base64,${response.data.data.searchDesignId.outputUrl3D}` : null,
          image2D: response.data.data.searchDesignId.outputUrl2D ? `data:image/png;base64,${response.data.data.searchDesignId.outputUrl2D}` : null
        };
        console.log(transformedDesign);
        setProject(transformedDesign);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [id]); // Dependency array with project ID

  const handleDrawerClose = () => setOpen(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleImageClick = (image) => setZoomedImage(image);
  const handleCloseZoom = () => setZoomedImage(null);


  const displayToaster = () => {
    toast.error("Please generate a design", {
      position: "top-left"
    });
  }

  const editMutation = `
    mutation EditDesign($designID: ID!, $description: String!) {
    editDesign(designID: $designID, description: $description) {
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

  const onSubmit = async (e) => {
    e.preventDefault();
    const regex = /\b(plan|floorplan|floor|room|bathroom|bedroom|living room|kitchen|dining room|sofa|table|chair|window|door|wall|ceiling|furniture)\b/i;
    if (!regex.test(description)) {
      toast.error("Please enter valid words", {
        position: "top-left"
      });
      return;
    }
    setLoading(false);
    try {
      const tokenPromise = localStorage.getItem('token');
      const token = await tokenPromise;

      

      const payload = {
        query: editMutation,
        variables: {
          designID: id, // Use the project ID from the URL parameters
          description: description
        }
      };

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(serverUrl, payload, { headers: headers });
      setLoading(true);
      const transformedDesign = {
        ...response.data.data.editDesign,
        image: response.data.data.editDesign.outputUrl3D ? `data:image/png;base64,${response.data.data.editDesign.outputUrl3D}` : null,
        image2D: response.data.data.editDesign.outputUrl2D ? `data:image/png;base64,${response.data.data.editDesign.outputUrl2D}` : null
      };

      if (response) {
        setProject(transformedDesign);
        toast.success("Design Updated Successfully", {
          position: "top-left"
        });
      }
    } catch (error) {
      console.error("Something went wrong", error.response ? error.response.data : error);
    }
  };

  return (
    <>
      <ToastContainer stacked />
      <Box
        component="form"
        onSubmit={onSubmit}
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
          <Header isDashboard={true} title={`Your Project Name: ${projectName}`} subTitle={"Edit your Project"} />
        </Stack>

        <TextField
          id="outlined-multiline-static"
          label="New Prompt"
          multiline
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {loading && <Box sx={{ textAlign: "right" }}>
          <Button sx={{ textTransform: "capitalize" }} className="btn" type="submit">
            <strong>Edit Image</strong>
            <div id="container-stars">
              <div id="stars" />
            </div>
            <div id="glow">
              <div className="circle" />
              <div className="circle" />
            </div>
          </Button>
        </Box>}
        {(project && loading) ?
          <div className="flex justify-center relative cursor-pointer" onClick={() => handleImageClick(project.image2D)}>
            <img src={project.image2D ? project.image2D : project.image} alt="" className="w-1/4" />
          </div>
          : !loading ?
            <div role="status">
              <svg aria-hidden="true" className="inline w-10 h-10 mr-2 text-gray-200 animate-spin fill-[#6469ff]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            </div>
            :
            <div className="flex justify-center space-x-20 relative cursor-pointer" onClick={displayToaster}>
              <img src="https://th.bing.com/th?id=OIP.UYefmuqvYGCqQqZN9xaW8QHaGp&w=263&h=236&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2" alt="img1" className="w-1/4" />
              <img src="https://th.bing.com/th?id=OIP.UYefmuqvYGCqQqZN9xaW8QHaGp&w=263&h=236&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2" alt="img2" className="w-1/4" />
            </div>}
        {zoomedImage && <ZoomedImage src={zoomedImage} onClose={handleCloseZoom} />}
      </Box>
    </>
  );
};

export default EditPage;
