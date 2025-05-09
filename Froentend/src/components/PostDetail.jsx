import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
        const localPost = savedPosts.find((p) => p.id === parseInt(id));

        if (localPost) {
          setPost(localPost);
        } else {
          const res = await axios.get(
            `https://jsonplaceholder.typicode.com/posts/${id}`
          );
          setPost(res.data);
        }
        const userId = localPost ? localPost.userId : post?.userId || 1;
        const userRes = await axios.get(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        setAuthor(userRes.data);
      } catch (err) {
        console.error("error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = () => {
    if (window.confirm(" want to delet the post")) {
      const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
      const filteredPosts = savedPosts.filter((p) => p.id !== parseInt(id));
      localStorage.setItem("blogPosts", JSON.stringify(filteredPosts));

      axios
        .delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .catch((err) => console.error("error delet", err));
      navigate("/");
    }
  };

  if (loading) return <div className="container mt-4">loading</div>;
  if (!post) return <div className="container mt-4">post not found</div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex align-items-center">
          <img
            src={`https://i.pravatar.cc/150?img=${author?.id || 1}`}
            alt={author?.name}
            className="rounded-circle me-3"
            width="50"
            height="50"
          />
          <h4 className="mb-0">{author?.name || "Unknown Author"}</h4>
        </div>
        <div className="card-body">
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
        <div className="card-footer d-flex justify-content-between">
          <div>
            <Link to={`/edit/${post.id}`} className="btn btn-primary">
              edit
            </Link>
          </div>
          <button onClick={handleDelete} className="btn btn-danger">
            delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
