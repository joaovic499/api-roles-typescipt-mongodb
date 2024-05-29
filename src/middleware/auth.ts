import { NextFunction, Response, Request } from "express"
import jwt from 'jsonwebtoken'

const secretKey = 'apiidopçekmjncxvvnmljo1993-0303@@@30230030@@@3030030'

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({
            error: 'true',
            message: 'Token não fornecido'
        });
    }

    const parts = authHeader.split(" ");
        if (parts.length !== 2) {
            return res.status(401).json({
                error: 'true',
                message: "Tipo de token invalido"
            });
        }

    const [scheme, token] = parts;
    if(scheme !== "Bearer"){
        return res.status(401).json({
            error: true,
            message: "Tipo de token invalido"
        });
    }

    jwt.verify(token, secretKey, (err, decoded) =>{
        if (err) {
            return res.status(401).json({
                error: true,
                message:"Token invalido/ expirado"
            });
        }

        req.user = decoded;
        next();
    });
}