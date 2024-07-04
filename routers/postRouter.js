import express from 'express';
import { createPost, deletePost, getPosts, getTags, updatePost } from '../controllers/postController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/tags', getTags);
router.get('/', getPosts);
router.post('/', auth, createPost)
router.put('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)

export default router;