import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Nav/Nav';

function Home() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, userRes] = await Promise.all([
          axios.get('https://jsonplaceholder.typicode.com/posts'),
          axios.get('https://jsonplaceholder.typicode.com/users'),
        ]);

        const savedPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const mergedPosts = [...savedPosts, ...postRes.data.slice(0,10)];

        const mergedWithAuthors = mergedPosts.map((post) => {
          const author = userRes.data.find((user) => user.id === post.userId);
          return {...post,
            authorName: author ? author.name : 'Unknown',
            authorImage: `https://i.pravatar.cc/150?img=${author ? author.id : 1}`,
          };
        });

        setPosts(mergedWithAuthors);
        setUsers(userRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <>
    <Navbar/>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>all posts</h2>
        <Link to="/addpost" className="btn btn-primary">
          Add New Post
        </Link>
      </div>

      <div className="row">
        {posts.map((post) => (
          <div key={post.id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={post.authorImage}
                    alt={post.authorName}
                    className="rounded-circle me-3"
                    width="40"
                    height="40"
                  />
                  <strong>{post.authorName}</strong>
                </div>
                <h4>{post.title}</h4>
                <p>{post.body.substring(0, 100)}...</p>
              </div>
              <div className="card-footer bg-transparent">
                <Link to={`/post/${post.id}`} className="btn btn-sm btn-outline-primary">
                  read more
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );

}

export default Home;
