import { User } from './../entity/User';
import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { MyDataSource } from '../data-source';
import { count } from 'console';
import { ObjectId } from 'mongodb';

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


    //const useroid = await userRepository.findOne({where: { _id: new ObjectId("6657599ded17d34068dd9bd0") } })

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
    const [novaSenha, senhaAtual] = [req.body.novaSenha, req.body.senhaAtual]
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)

    if(!token){
        return res.status(401).json({error: "Token não fornecido"})
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    console.log(decoded)
    const userId = decoded.id;
    console.log(userId)

    const usuario = await userRepository.findOne({ where: { _id: new ObjectId(userId)}});
    console.log(usuario)

    if(!usuario){
        return res.status(404).json({ error: "Usuario não encontrado"})
    }
    
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.password);

    if(!senhaCorreta){
        return res.status(400).json({ error: "Senha Atual Incorreta"});
    }

    const hashedNovaSenha = await bcrypt.hash(novaSenha, 10);
    usuario.password = hashedNovaSenha;

    await userRepository.save(usuario);

    return res.json({
        message: "Senha do funcionario alterada com sucesso"
    });
 }catch(error){
    if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({error: "Token inválido"});
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor"});
    }
}
