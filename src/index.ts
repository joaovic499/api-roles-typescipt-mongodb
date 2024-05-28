import 'reflect-metadata';
var cors = require('cors')
import { createConnection, getMongoRepository } from 'typeorm';
import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { User } from './entity/User';
import bcrypt from 'bcrypt';
import { authenticateJWT } from './middleware/auth';

const app = express();
app.use(cors())
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

createConnection().then(async connection => {
  const userRepository = getMongoRepository(User);
  // Verificar se o super admin já existe
  const superAdmin = await userRepository.findOne({ where: { username: 'superadmin' }});
  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash('superadminpassword', 10);
    const newAdmin = userRepository.create({
      username: 'superadmin',
      password: hashedPassword,
      role: 'admin'
    });
    await userRepository.save(newAdmin);
    console.log('Super admin criado');
  }
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(error => console.log(error));
