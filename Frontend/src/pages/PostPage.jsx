import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostAndComments = async () => {
    setLoading(true);
    try {
      const postRes = await api.get(`/posts/${id}`);
      setPost(postRes.data);
      
      const commentsRes = await api.get(`/comments/${id}`);
      setComments(commentsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      await api.post(`/comments/${id}`, { content: newComment });
      setNewComment('');
      fetchPostAndComments(); // Refetch all
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        fetchPostAndComments(); // Refetch all
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete post');
      }
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!post) return <p>Post not found.</p>;
  
  const isAuthor = user && user._id === post.author._id;
  const isAdmin = user && user.role === 'Admin';

  return (
    <div className="post-full">
      <div className="post-full-header">
        <div>
          <h1>{post.title}</h1>
          <div className="post-full-meta">
            By <span>{post.author.username}</span> on {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
        {(isAuthor || isAdmin) && (
          <div className="post-actions">
            <Link to={`/posts/${id}/edit`} className="btn btn-edit">Edit</Link>
            <button onClick={handleDeletePost} className="btn btn-delete">Delete</button>
          </div>
        )}
      </div>

      <div className="post-full-content">
        {post.content}
      </div>
      
      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>
        
        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="form-group">
              <label htmlFor="comment">Add a comment</label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows="3"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn" style={{ backgroundColor: '#007bff', color: 'white' }}>
              Post Comment
            </button>
          </form>
        ) : (
          <p>You must be <Link to="/login">logged in</Link> to comment.</p>
        )}
        
        {/* Comments List */}
        <div style={{ marginTop: '2rem' }}>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="comment">
                <div className="comment-meta">
                  <strong>{comment.author.username}</strong>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p>{comment.content}</p>
                {(user && (user._id === comment.author._id || user.role === 'Admin')) && (
                  <button 
                    onClick={() => handleDeleteComment(comment._id)} 
                    className="comment-delete-btn"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
