import { User } from './../entity/User';
import { NextFunction, Response, Request } from "express"
import jwt from 'jsonwebtoken'

const secretKey = 'apiidopçekmjncxvvnmljo1993-0303@@@30230030@@@3030030'

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error('Erro ao verificar o token JWT:', err);
                return res.sendStatus(403);
            }
            req.user = decoded;
            next();
        });
    } else {
        console.error('Token JWT ausente na requisição');
        res.sendStatus(401);
    }
    
};