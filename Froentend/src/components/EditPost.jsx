import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const localPost = savedPosts.find((post) => post.id === parseInt(id));

    if (localPost) {
      setTitle(localPost.title);
      setBody(localPost.body);
    } else {
      axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setBody(res.data.body);
        })
        .catch((err) => {
          console.error('error fetch post', err);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        title,
        body,
        userId: 1,
      })
      .then(() => {
        const savedPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const updatedPosts = savedPosts.map((post) =>
          post.id === parseInt(id) ? { ...post, title, body } : post
        );
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));

        navigate(`/post/${id}`);
      })
      .catch((err) => {
        console.error('Error updating post:', err);
      });
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <h2>Edit Post</h2>
        <div className="mb-3">
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
