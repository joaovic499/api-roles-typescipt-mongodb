import { deleteUsuario, editarUsuario, todosUsuarios, totalFuncionarios, trocarSenha } from './../auth/authController';
import express, { Router } from 'express';
import { login, register } from '../auth/authController';
import { count } from 'console';
import { authenticateJWT } from '../middleware/auth';
import { authorizeAdmin, authorizeUser } from '../middleware/authorize';

const router = Router();
router.delete("/delete/usuario/:id", deleteUsuario)
router.get('/all/usuarios', authenticateJWT, authorizeAdmin, todosUsuarios)
router.put('/changePassword', authenticateJWT, trocarSenha)
router.put('/edit/usuario/:id', authenticateJWT, authorizeAdmin, editarUsuario)
router.get('/count', totalFuncionarios, authorizeAdmin, authorizeUser)
router.post('/login', login);
router.post('/register', register);

export default router;