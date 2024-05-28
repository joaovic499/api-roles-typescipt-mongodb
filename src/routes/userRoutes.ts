import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { authorizeAdmin, authorizeUser} from '../middleware/authorize';
import { UserController } from '../controller/UserController';

const router = Router();
const userController = new UserController();

router.get('/users', authenticateJWT, authorizeAdmin, userController.all);
router.get('/users/:id', authenticateJWT, authorizeAdmin, userController.one);
router.post('/users', authenticateJWT, authorizeAdmin, userController.save);
router.delete('/users/:id', authenticateJWT, authorizeAdmin, userController.remove);

export default router;