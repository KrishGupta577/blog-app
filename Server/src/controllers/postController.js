import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags, status } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const post = new Post({
    title,
    content,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    status,
    author: req.user._id,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// ... (keep getAllPosts function as-is)
const getAllPosts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  
  const keyword = req.query.search
    ? {
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { content: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};
  
  const query = {
    ...keyword,
    status: 'published',
  };

  const count = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate('author', 'username')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ posts, page, pages: Math.ceil(count / pageSize), total: count });
});

const getMyPosts = asyncHandler(async (req, res) => {
  let query = {};
  
  if (req.user.role !== 'Admin') {
    query.author = req.user._id;
  }
  
  const posts = await Post.find(query)
    .populate('author', 'username')
    .sort({ createdAt: -1 });
    
  res.json(posts);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');

  if (post) {
    if (post.status === 'published') {
      return res.json(post);
    }
    
    if (req.user) {
      const isAuthor = post.author._id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'Admin';

      if (isAuthor || isAdmin) {
        return res.json(post);
      }
    }
    
    res.status(404);
    throw new Error('Post not found or you do not have permission');
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content, tags, status } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const isAuthor = post.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'Admin';

  if (!isAuthor && !isAdmin) {
    res.status(403);
    throw new Error('User not authorized to update this post');
  }

  post.title = title || post.title;
  post.content = content || post.content;
  post.tags = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;
  post.status = status || post.status;

  const updatedPost = await post.save();
  res.json(updatedPost);
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const isAuthor = post.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'Admin';

  if (!isAuthor && !isAdmin) {
    res.status(403);
    throw new Error('User not authorized to delete this post');
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  
  res.json({ message: 'Post removed' });
});

export { createPost, getAllPosts, getMyPosts, getPostById, updatePost, deletePost };