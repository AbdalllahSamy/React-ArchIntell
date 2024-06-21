import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from './../../scenes/navbar';
import { Box, Button, Stack, TextField } from '@mui/material';
import SideBar from 'components/SideBar';

const CardDetails = () => {
    const location = useLocation();
    const designId = location.pathname.split('/').pop(); // Extract designId from URL
    const [post, setPost] = useState(null);
    const [open, setOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);

    const handleDrawerClose = () => setOpen(false);
    const handleDrawerOpen = () => setOpen(true);
    const [isFollowing, setIsFollowing] = useState(false); // Track follow state
    const [loadingFollow, setLoadingFollow] = useState(false); // Loading state for follow/unfollow actions

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token'); // Replace with your authentication logic
                const serverUrl = 'http://localhost:9595/graphql'; // Replace with your GraphQL server URL

                const payload = {
                    query: `
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
                    `,
                    variables: {
                        designId: designId,
                    },
                };

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };

                const response = await axios.post(serverUrl, payload, { headers });
                if (response.data && response.data.data && response.data.data.searchDesignId) {
                    const transformedPost = {
                        ...response.data.data.searchDesignId,
                        image: response.data.data.searchDesignId.outputUrl3D ? `data:image/png;base64,${response.data.data.searchDesignId.outputUrl3D}` : null,
                        image2D: response.data.data.searchDesignId.outputUrl2D ? `data:image/png;base64,${response.data.data.searchDesignId.outputUrl2D}` : null
                    };
                    setPost(transformedPost);
                    setComments(transformedPost.comments); // Initialize comments state with fetched comments
                } else {
                    console.error('No data found for designId:', designId);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [designId]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Replace with your authentication logic
            const serverUrl = 'http://localhost:9595/graphql'; // Replace with your GraphQL server URL

            const payload = {
                query: `
                    mutation addComment($designId: ID!, $comment: String!) {
                        addComment(designId: $designId, comment: $comment) {
                            comments {
                            _id
                            comment
                            username
                            createdAt
                            }
                        }
                    }
                `,
                variables: {
                    designId: post._id,
                    comment: commentText,
                },
            };

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.post(serverUrl, payload, { headers });
            console.log(response);
            if (response.data && response.data.data && response.data.data.addComment) {
                setComments(response.data.data.addComment.comments); // Add new comment to local state
                setCommentText(''); // Clear comment input
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleFollowToggle = async () => {
        setLoadingFollow(true); // Start loading state

        try {
            const token = localStorage.getItem('token'); // Replace with your authentication logic
            const serverUrl = 'http://localhost:9595/graphql'; // Replace with your GraphQL server URL

            let payload;
            if (isFollowing) {
                payload = {
                    query: `
                        mutation unFollowUser($userId: ID!) {
                            unFollowUser(userId: $userId) {
                                _id
                                username
                                email
                                image
                                createdDesigns {
                                    _id
                                }
                            }
                        }
                    `,
                    variables: {
                        userId: post.creator._id,
                    },
                };
            } else {
                payload = {
                    query: `
                        mutation followUser($userId: ID!) {
                            followUser(userId: $userId) {
                                _id
                                username
                                email
                                image
                                createdDesigns {
                                    _id
                                }
                            }
                        }
                    `,
                    variables: {
                        userId: post.creator._id,
                    },
                };
            }

            console.log(1);
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await axios.post(serverUrl, payload, { headers });
            if (response.data) {
                setIsFollowing(!isFollowing); // Toggle follow state
            } else if (response.status === 500) {
                setIsFollowing(false); // Set unfollowed state if 500 error
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setLoadingFollow(false); // Stop loading state
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token'); // Replace with your authentication logic
            const serverUrl = 'http://localhost:9595/graphql'; // Replace with your GraphQL server URL
    
            const payload = {
                query: `
                    mutation deleteComment($designId: ID!, $commentId: ID!) {
                        deleteComment(designId: $designId, commentId: $commentId) {
                            comments {
                                _id
                                comment
                                username
                                createdAt
                            }
                        }
                    }
                `,
                variables: {
                    designId: post._id, // Assuming post._id is accessible here
                    commentId: commentId,
                },
            };
    
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
    
            const response = await axios.post(serverUrl, payload, { headers });
            if (response.data && response.data.data && response.data.data.deleteComment) {
                const updatedComments = response.data.data.deleteComment.comments;
                setComments(updatedComments); // Update local state with new comments list after deletion
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };
    

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <SideBar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
            <Box>
                <Navbar />
            </Box>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row items-center">
                    {/* Left section for image */}
                    <div className="lg:w-1/2 mb-4 lg:mb-0">
                        <img
                            src={post.image ? post.image : post.image2D}
                            alt={post.description}
                            className="rounded-xl object-cover w-full h-auto"
                        />
                    </div>

                    {/* Right section for details */}
                    <div className="lg:w-1/2 lg:ml-4 text-center lg:text-left">
                        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                        <p className="text-gray-600 text-sm mb-4">{post.description}</p>

                        {/* Follow button */}
                        <Button
                            onClick={handleFollowToggle}
                            disabled={loadingFollow}
                            className={`bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg mb-4 ${loadingFollow ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>

                        {/* Likes */}
                        <div className="flex items-center justify-center lg:justify-start mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            <p className="text-gray-600">{post.likes ? post.likes.length : 0} Likes</p>
                        </div>

                        {/* Creator details */}
                        <div className="flex items-center justify-center lg:justify-start mb-4">
                            <img
                                src={post.creator && post.creator.image ? post.creator.image : ''}
                                alt={post.creator && post.creator.username ? post.creator.username : ''}
                                className="w-10 h-10 rounded-full object-cover mr-2"
                            />
                            <p className="text-gray-600">{post.creator ? post.creator.username : ''}</p>
                        </div>

                        {/* Comment section */}
                        <form onSubmit={handleCommentSubmit} className="mb-4">
                            <TextField
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                label="Add a comment"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                className="mb-2"
                            />
                            <Button type="submit" variant="contained" color="primary" className="w-full">
                                Post Comment
                            </Button>
                        </form>

                        {/* Display comments */}
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment._id} className="flex items-center space-x-2">
                                    <div className='border w-full p-4'>
                                        <p className="font-semibold">{comment.username}</p>
                                        <p className="text-gray-600">{comment.comment}</p>
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-2"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardDetails;
