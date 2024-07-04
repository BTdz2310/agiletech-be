import express from 'express';
import { login, logout, refreshToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/refresh-token', refreshToken);
router.delete('/logout', logout);

export default router;