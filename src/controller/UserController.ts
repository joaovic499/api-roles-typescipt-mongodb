import { Request, Response } from "express";
import { getMongoManager, getMongoRepository } from "typeorm";
import { User } from '../entity/User'

export class UserController {

    async all(req: Request, res:Response) {;
        const users = getMongoRepository(User).find();
        res.json(users);
    }

    async one(req: Request, res: Response) {
        const user = await getMongoRepository(User).findOne({where: {id: parseInt(req.params.id, 10)}})
    }

    async save(req: Request, res: Response) {
        const user = await getMongoRepository(User).save(req.body);
        res.json(user);
    }

    async remove(req: Request, res: Response){
        const userToRemove = await getMongoRepository(User).findOne({where: {id: parseInt(req.params.id, 10)}})
        if (userToRemove) {
            await getMongoRepository(User).remove(userToRemove);
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }
}
