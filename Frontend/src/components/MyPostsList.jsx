import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const MyPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/posts/myposts');
        setPosts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyPosts();
  }, []);

  if (loading) return <p>Loading your posts...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="my-posts-list">
      <h2>{user.role === 'Admin' ? 'All Posts' : 'My Posts'}</h2>
      {posts.length === 0 ? (
        <p>You have not created any posts yet.</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              <div>
                <strong>{post.title}</strong>
                {user.role === 'Admin' && (
                  <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#777' }}>
                    by {post.author.username}
                  </span>
                )}
              </div>
              <div className="post-links">
                <span 
                  className={`post-status ${post.status === 'draft' ? 'post-status-draft' : 'post-status-published'}`}
                >
                  {post.status}
                </span>
                <Link to={`/posts/${post._id}`}>View</Link>
                <Link to={`/posts/${post._id}/edit`}>Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPostsList;