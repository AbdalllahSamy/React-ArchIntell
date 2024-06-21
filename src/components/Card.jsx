import React, { useState } from 'react';
import { FaDownload, FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import axios from 'axios';
import { downloadImage } from './../utils'; 
import { Link } from 'react-router-dom';
// Ensure this is correctly imported


const Card = ({ post }) => {
  const likeMutation = `
  mutation likeDesign($designId: ID!) {
    likeDesign(designId: $designId) {
      likes {
        createdAt
        username
      }
    }
  }
`;

  const dislikeMutation = `
  mutation unLikeDesign($designId: ID!) {
    unLikeDesign(designId: $designId) {
      likes {
        createdAt
        username
      }
    }
  }
`;


  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = currentUser ? currentUser._id : null;
  const initialIsLiked = post.likes.some(like => like.id === currentUserId);
  // isFollow = 1 ? 0
  // isLiked = 1 ? 0
  const [isLiked, setIsLiked] = useState(initialIsLiked); // Replace 'currentUserName' with the actual username of the current user
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {

    const mutation = isLiked ? dislikeMutation : likeMutation;
    if (isLiked && mutation === likeMutation) {
      console.log("Already liked by the current user.");
      return;
    }
    console.log(mutation);
    try {
      const token = localStorage.getItem('token');

      const payload = {
        query: mutation,
        variables: {
          designId: post._id
        }
      };

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const serverUrl = 'http://localhost:9595/graphql';

      const response = await axios.post(serverUrl, payload, { headers: headers });
      console.log(response);
      if (response) {
        setIsLiked(!isLiked);
        setLikesCount(response.data.data.likeDesign ? response.data.data.likeDesign.likes.length : response.data.data.unLikeDesign.likes.length)
      }
    } catch (error) {
      console.error("Something went wrong", error.response ? error.response.data : error);
    }
  };

  

  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
      <Link
          
          to={{
            pathname: `/post/${post._id}`,
            state: { post: post } // Passing the post data
          }}
        >
        <img
          className="w-full h-auto object-cover rounded-xl"
          src={post.image ? post.image : post.image2D}
          alt={post.description}
        />
        </Link>
        <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
          <p className="text-white text-sm overflow-y-auto prompt">{post.description}</p>

          <div className="mt-5 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`text-[2em] rounded-full object-cover flex justify-center items-center text-white text-xs font-bold cursor-pointer ${isLiked ? 'text-red-500' : ''}`}
                onClick={handleLike}
              >
                {(isLiked || (post.likes.length > 0 && post.likes.some(like => like.id === currentUserId))) ? <FaHeart /> : <CiHeart />}
              </div>
              <p className="text-white text-sm">{likesCount} Likes</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold"></div>
              <p className="text-white text-sm">{post.title}</p>
            </div>
            <button
              type="button"
              onClick={() => downloadImage(post._id, post.image ? post.image : post.image2D)}
              className="!text-white"
            >
              <FaDownload className="w-6 h-6 !text-white" />
            </button>
          </div>
        </div>
      </div>
  );
};

export default Card;