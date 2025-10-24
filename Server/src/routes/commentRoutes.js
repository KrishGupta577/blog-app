import express from 'express';
import {
  addComment,
  getCommentsForPost,
  deleteComment,
} from '../controllers/commentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/:postId')
  .post(protect, addComment)
  .get(getCommentsForPost);

router.route('/:commentId')
  .delete(protect, deleteComment);

export default router;