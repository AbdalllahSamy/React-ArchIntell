import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  // const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
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
    setPosts(designs);
  };

  const getUserPosts = async () => {
    // const response = await fetch(
    //   `http://localhost:3001/posts/${userId}/posts`,
    //   {
    //     method: "GET",
    //     headers: { Authorization: `Bearer ${token}` },
    //   }
    // );
    // const data = await response.json();
    // dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    console.log("posts", posts);
    if (isProfile) {
      getPosts();
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts ? (
        posts.map((post) => (
          <PostWidget
            key={post._id}
            postId={post._id}
            // postUserId={post.creator._id} // Assuming creator._id is the userId
            // name={`${post.creator.username}`} // Adjust as per your data structure
            description={post.description}
            // location={post.creator.location} // Assuming creator has a location field
            picturePath={post.image ? post.image : post.image2D} // Adjust based on your data structure
            // userPicturePath={post.creator.image} // Assuming creator has an image field
            likes={post.likes}
            comments={post.comments}
          />
        ))
      ) : (
        <p>Loading posts...</p>
      )}
    </>
  );
};

export default PostsWidget;
