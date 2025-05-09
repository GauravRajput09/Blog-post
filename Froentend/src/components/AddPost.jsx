import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://jsonplaceholder.typicode.com/posts", {
        title,
        body,
        userId: 1,
      })
      .then((response) => {
        const savedPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];
        const newPost = {
          ...response.data,
          id:
            savedPosts.length > 0
              ? Math.max(...savedPosts.map((p) => p.id)) + 1
              : 101,
        };

        const updatedPosts = [newPost, ...savedPosts];
        localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

        navigate("/");
      })
      .catch((err) => {
        console.error("Error adding post:", err);
      });
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <h2>add new post</h2>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="description"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          add post
        </button>
      </form>
    </div>
  );
}

export default AddPost;
