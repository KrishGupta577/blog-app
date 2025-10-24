import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Pass page to the API
        const { data } = await api.get(`/posts?page=${page}`);
        setPosts(data.posts);
        setPage(data.page);
        setTotalPages(data.pages);
      } catch (err) {
        setError('Failed to fetch posts. Is the backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]); // Re-fetch when page changes

  return (
    <div>
      <h1>Published Blog Posts</h1>
      
      {loading && <p style={{ textAlign: 'center' }}>Loading posts...</p>}
      
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div>
          {posts.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No published posts found.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                <h2>
                  {/* Make title a link */}
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                </h2>
                <p>{post.content.substring(0, 200)}...</p>
                <p className="post-author">By: {post.author.username}</p>
              </div>
            ))
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPage(p => p - 1)} 
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => p + 1)} 
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;