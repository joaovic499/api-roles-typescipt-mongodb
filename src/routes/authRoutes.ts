import { totalFuncionarios, trocarSenha } from './../auth/authController';
import express, { Router } from 'express';
import { login, register } from '../auth/authController';
import { count } from 'console';

const router = Router();

router.put('/changePassword', trocarSenha )
router.get('/count', totalFuncionarios)
router.post('/login', login);
router.post('/register', register);

export default router;