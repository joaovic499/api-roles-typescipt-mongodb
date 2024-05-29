import { getMongoRepository } from 'typeorm';
import { Request, Response } from "express";
import { User } from '../entity/User';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { MyDataSource } from '../data-source';

const secretKey = 'apiidopçekmjncxvvnmljo1993-0303@@@30230030@@@3030030'
const userRepository = MyDataSource.getMongoRepository(User)

export const login = async (req: Request, res: Response) => {
    const {username, password } = req.body;
    const user = await userRepository.findOne({ where: { username }});

    if( user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, role: user.role}, secretKey, {expiresIn: '1h'});
        res.json({ token, user: {username: user.username, role: user.role} });
    } else {
        res.status(401).json({ message: 'Credenciais invalida '});
    };
}

export const register = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    
    if(!role) {
        const roleUser = 'user';
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({ username, password: hashedPassword, role: roleUser});
        await userRepository.save(newUser);
        res.status(201).json(newUser);

    } else {
        const roleAdmin = 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({ username, password: hashedPassword, role: roleAdmin});
        await userRepository.save(newUser);
        res.status(201).json(newUser);
    }    
}

export const teste = async (req: Request, res: Response) => {
        res.status(200).json({ message: "Bem vindo" });
    }
