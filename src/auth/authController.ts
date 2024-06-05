import { User } from './../entity/User';
import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { MyDataSource } from '../data-source';
import { count } from 'console';
import { ObjectId } from 'mongodb';
import { UserController } from '../controller/UserController'

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

export const todosUsuarios = async (re: Request, res: Response) => {
    try{
        const users = await userRepository.find();
        res.status(201).json(users);
            } catch (error) {
                console.log('Erro ao recuperar os usuários', error);
                res.status(500).json({ error: 'Erro interno do servidor'});
            }

}

export const editarUsuario = async (req: Request, res: Response) => {
    try {
        const {username, role} = req.body;
        const id = req.params.id;
        const user = await userRepository.findOne({where: { _id: new ObjectId(id)}})

        if(!user){
            return res.status(404).json({error: "Usuário não encontrado"});
    }

    user.username = username;
    user.role = role;
    await userRepository.save(user);

    return res.json({
        user,
        message: "Usuario editado com sucesso"
    });

    } catch (error) {
        console.log("Erro ao editar o usuario", error);
        return res.status(500).json({error: "Erro ao editar um usuário"});
    }


}
