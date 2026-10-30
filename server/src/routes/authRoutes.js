import express from 'express';
import { registerUser, loginUser, getCurrentUser, updateLanguage } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser);
router.post('/language', updateLanguage);

export default router;
