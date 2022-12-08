import { Request, Response } from 'express';
import { Database } from '../database/database';

const db = new Database("hospitals");

export async function login(req: Request, res: Response){
    const { email, password } = req.body as Record<string, any>;
    
    if (!email || !password){
        res.status(400).send({
            success: false,
            error: "Please fill in all the fields.",
        });
        return;
    }

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
    return;
}

export async function register(req: Request, res: Response){
    let account = req.body as Record<string, any>;
    const { email, password, name, location, contactNum, maxBeds, availableBeds } = req.body as Record<string, any>;

    // Check all fields 
    if (!email || !password || !name || !location || !contactNum || !maxBeds){
        res.status(400).send({
            success: false,
            error: "Please fill in all the required fields.",
        });
        return;
    }
    
    // Check if an account exists under such email
    const emailExists = await db.collection.findOne({ email: email });
    if (emailExists){
        res.status(400).send({
            success: false,
            error: "An account is already registered with this email.",
        });
        return;
    }

    // Check if an account with the same hospital name exists
    const nameExists = await db.collection.findOne({ name: name });
    if (nameExists){
        res.status(400).send({
            success: false,
            error: "An account is already registered with this hospital name.",
        });
        return;
    }

    account.maxBeds = Number(account.maxBeds);
    // Check if there is an input for available beds
    if (!availableBeds){
        account = {
            ...account,
            availableBeds: maxBeds,
        }
    }
    account.availableBeds = Number(account.availableBeds);
    await db.collection.insertOne(account);
    delete account.password;
    res.status(200).send({
        success: true,
        ...account,
    });
    return;
}