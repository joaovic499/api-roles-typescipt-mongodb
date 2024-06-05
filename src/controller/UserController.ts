import { Request, Response } from "express";
import { User } from '../entity/User'
import { MyDataSource } from "../data-source";

const userRepository = MyDataSource.getMongoRepository(User)
export class UserController {

    async contar(req: Request, res:Response){
        const contar = userRepository.countDocuments(User);
        res.json({ count: contar})
        
    }

    async all(req: Request, res:Response) {
        const users = userRepository.find();
        res.json(users);
    }

    async one(req: Request, res: Response) {
        const user = await userRepository.findOne({where: {id: parseInt(req.params.id, 10)}})
    }

    async save(req: Request, res: Response) {
        const user = await userRepository.save(req.body);
        res.json(user);
    }

    async remove(req: Request, res: Response){
        const userToRemove = await userRepository.findOne({where: {id: parseInt(req.params.id, 10)}})
        if (userToRemove) {
            await userRepository.remove(userToRemove);
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }
}
