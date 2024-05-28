import { NextFunction, Request, Response } from 'express';
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.sendStatus(403);
    }

};

export const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === 'user') {
        next();
    } else {
        res.sendStatus(403);
    }

};