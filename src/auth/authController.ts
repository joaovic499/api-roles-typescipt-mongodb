import { User } from './../entity/User';
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { MyDataSource } from '../data-source';
import { count } from 'console';

const secretKey = 'apiidopçekmjncxvvnmljo1993-0303@@@30230030@@@3030030'
const userRepository = MyDataSource.getMongoRepository(User)

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
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

export const totalFuncionarios = async (req: Request, res: Response) => {
            const countFuncionario = await userRepository.countDocuments();
            res.json({count: countFuncionario});
    }

export const trocarSenha = async (req: Request, res: Response) => {
    try{
    const [novaSenha, senhaAtual, token] = [req.body.novaSenha, req.body.senhaAtual, req.params.token]

    const usuario = await userRepository.findOne({ where: { token }});

    if(!usuario){
        return res.status(404).json({ error: "Usuario não encontrado"})
    }
    
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.password);

    if(!senhaCorreta){
        return res.status(400).json({ error: "Senha Atual Incorreta"});
    }

    usuario.password = novaSenha;

    await userRepository.save(usuario);

    return res.json({
        message: "Senha do funcionario alterada com sucesso"
    });
 }catch(error){
    console.error(error);
    }
}
