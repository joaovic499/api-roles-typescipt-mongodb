import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload} from 'jsonwebtoken';
const secretKey = 'apiidopçekmjncxvvnmljo1993-0303@@@30230030@@@3030030'
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    try{
    const token = req.headers.authorization?.split(' ')['1'];
    console.log(token);

    if(!token){
        return res.status(401).json({error: "Token não fornecido"})
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    const userRole = decoded.role;
    console.log(userRole)
    if (userRole === 'admin') {
        next();
    } else {
        res.sendStatus(403);
    }
}catch(error){
    if (error instanceof jwt.JsonWebTokenError){
        return res.status(401).json({error: "Token inválido"});
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor"});
}
};

export const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.headers.authorization?.split(' ')['1'];
        console.log(token);

        if(!token){
            return res.status(401).json({error: "Token não fornecdo"})
        }

        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        const userRole = decoded.role;
        console.log(userRole)
        if(userRole === 'user') {
            next();
        } else {
            res.sendStatus(403);
        }
    } catch(error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(500).json({ error: "Erro interno do servidor"});
        }
    };

};