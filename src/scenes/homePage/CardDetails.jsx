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
                    <div className="lg:w-1/2 mb-4 lg:mb-0 self-start">
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
                                src={"data:image/jpeg;base64,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"}
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
