import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import SideBar from "components/SideBar";
import { Link } from 'react-router-dom';
import { Button, Stack, useTheme } from "@mui/material";
import FormField from './../../components/FormField';
import Card from './../../components/Card';
import Loader from './../../components/Loader';

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return (
      data.map((post) => (

        <Card post={post} key={post._id} />
      ))
    );
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const HomePage = () => {
  // const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  // const { _id, picturePath } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  const token = useSelector((state) => state.token);
  const [open, setOpen] = React.useState(false);
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const id = JSON.parse(localStorage.getItem("user"))._id;
      console.log(id);
      const query = `
    query des{
  designs{
    _id
    title
    description
    model_type
    outputUrl2D
    outputUrl3D
    creator {
        _id
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
      const response = await fetch("http://localhost:9595/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const { data } = await response.json();

      const designs = data.designs.map(design => ({
        ...design,
        image: design.outputUrl3D ? `data:image/png;base64,${design.outputUrl3D}` : null,
        image2D: design.outputUrl2D ? `data:image/png;base64,${design.outputUrl2D}` : null,
      }));
      console.log(designs);

      if (response) {
        setAllPosts(designs);
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()) || item.description.toLowerCase().includes(searchText.toLowerCase()));
        setSearchedResults(searchResult);
      }, 500),
    );
  };

  return (
    <>
      <Box>
        <SideBar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
      </Box>
      <Box>
        <Navbar />
      </Box>
      <section className="max-w-7xl mx-auto">

        <div className="mt-10">
          <FormField
            labelName=""
            type="text"
            name="text"
            placeholder="Search something..."
            value={searchText}
            handleChange={handleSearchChange}
          />
        </div>


        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>

              <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                {searchText ? (
                  <RenderCards
                    data={searchedResults}
                    title="No Search Results Found"
                  />
                ) : (
                  <RenderCards
                    data={allPosts}
                    title="No Posts Yet"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>

  );
};

export default HomePage;
