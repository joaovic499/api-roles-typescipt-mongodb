import 'reflect-metadata';
var cors = require('cors')
import express from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { User } from './entity/User';
import bcrypt from 'bcrypt';
import { MyDataSource } from './data-source';


const app = express();
app.use(cors())
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
const userRepository = MyDataSource.getMongoRepository(User)

MyDataSource.initialize().then(async () => {
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
    console.log('Server is rodando na port 3000');
  });
}).catch(error => console.log(error));
