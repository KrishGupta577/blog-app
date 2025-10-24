import asyncHandler from 'express-async-handler';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!content) {
    res.status(400);
    throw new Error('Comment content is required');
  }

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.status !== 'published') {
    res.status(400);
    throw new Error('Cannot comment on an unpublished post');
  }

  const comment = new Comment({
    content,
    author: req.user._id,
    post: postId,
  });

  const createdComment = await comment.save();
  res.status(201).json(createdComment);
});

const getCommentsForPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'username')
    .sort({ createdAt: 'desc' });
  
  res.json(comments);
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  const isAuthor = comment.author.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'Admin';

  if (!isAuthor && !isAdmin) {
    res.status(403);
    throw new Error('User not authorized to delete this comment');
  }

  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
});

export { addComment, getCommentsForPost, deleteComment };