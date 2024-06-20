import React from 'react'
import { CiShare1 } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';



export const Card = ({ project }) => {

    const query = `
  mutation deletDesign($designId: String!) {
    deletDesign(designId: $designId) {
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
    
    const deletePost = async (e, designId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // const tokenPromise = localStorage.getItem('token');
            // const token = await tokenPromise;
            const payload = {
                query: query,
                variables: {
                    designId: designId
                }
            };

            console.log('Design Input:', project);
            console.log('Design ID:', designId);

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.post(serverUrl, payload, { headers: headers });
            
            // console.log('Response:', transformedDesign);
            if (response) {
                if (response.data.errors) {
                    console.error("GraphQL Errors:", response.data.errors);
                } else {
                    console.log("Mutation Response:", response.data);
                }
            }
        } catch (error) {
            console.error("Something went wrong", error.response ? error.response.data : error);
        }
    };
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0'); // Ensure two-digit format
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-4 w-64">
            <div className="h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                <img src={project.image ? project.image : project.image2D} alt={project.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
                <h2 className="font-bold text-l text-black">{project.title}</h2>
                <p className="text-black">{formatDate(project.createdAt)}</p>
            </div>
            <div className="flex justify-end mt-4">
                <button className="text-blue-500 text-xl mr-2 hover:text-blue-700" onClick={(e) => deletePost(e, project._id)}>
                    <MdDelete />
                </button>
                <button className="text-blue-500 text-xl hover:text-blue-700">
                    <FaUserFriends />
                </button>
            </div>
        </div>
    )
}
