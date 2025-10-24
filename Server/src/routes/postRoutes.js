import express from 'express';
import {
  createPost,
  getAllPosts,
  getMyPosts, 
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllPosts)
  .post(protect, authorize('Writer', 'Admin'), createPost);

router.get('/myposts', protect, authorize('Writer', 'Admin'), getMyPosts);
  
router.route('/:id')
  .get(getPostById)
  .put(protect, authorize('Writer', 'Admin'), updatePost)
  .delete(protect, authorize('Writer', 'Admin'), deletePost);

export default router;