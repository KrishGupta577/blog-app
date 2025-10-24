import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import MyPostsList from '../components/MyPostsList'; // Import new component

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const postData = { title, content, tags, status };
      await api.post('/posts', postData);
      setSuccess('Post created successfully!');
      setTitle('');
      setContent('');
      setTags('');
      setStatus('draft');
      // In a real app, you'd trigger a refresh of the MyPostsList
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '100%' }}>
      <h2>Create New Post</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button type="submit" className="btn-submit">
          Create Post
        </button>
      </form>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <p>Your role is: <strong>{user.role}</strong></p>
      </div>

      {user.role === 'Reader' && (
        <div className="post-card">
          <h2>Reader Dashboard</h2>
          <p>As a Reader, you can browse and comment on published posts from the <Link to="/">Home Page</Link>.</p>
        </div>
      )}

      {(user.role === 'Writer' || user.role === 'Admin') && (
        <>
          <CreatePostForm />
          <MyPostsList />
        </>
      )}
    </div>
  );
};

export default DashboardPage;