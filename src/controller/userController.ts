import { Request, Response } from 'express';
import { Database } from '../database/database';

const db = new Database("hospitals");

export async function login(req: Request, res: Response){
    const { email, password } = req.body as Record<string, any>;
    const profile = await db.collection.findOne({email: email});
    
    // Check if a user was found
    if (!profile){
        res.status(400).send({
            success: false,
            error: "No account has been registered for this email.",
        });
        return;
    }

    // Check if queried password is equal to inputted password
    if (profile.password !== password){
        res.status(400).send({
            success: false,
            error: "Something went wrong.",
        });
        return;
    }

    delete profile.password;
    res.status(200).send({
        success: true,
        ...profile,
    });
}