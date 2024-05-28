import express, { Router } from 'express';
import { login, register, teste } from '../auth/authController';

const router = Router();


router.get('/', teste)
router.post('/login', login);
router.post('/register', register);

export default router;