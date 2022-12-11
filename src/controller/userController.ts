import { Request, Response } from 'express';
import { Database } from '../database/database';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import websiteConfig from '../config/websiteConfig';
import { RequestWithID } from '../types';

const { ObjectId } = require('mongodb');
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

    const accessToken = jwt.sign(
        {
            _id: profile._id.toString(),
            iat: Date.now(),
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.duration,
        }
    );
    res.cookie("authorization", accessToken);
    res.status(200).send({
        success: true,
    });
    return;
}

export async function logout(req: Request, res: Response){
    res.clearCookie("authorization");
    res.redirect(websiteConfig.baseUrl + "/interface/login");
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

    const insertStatus = await db.collection.insertOne(account);
    const accessToken = jwt.sign(
        {
            _id: insertStatus.insertedId.toString(),
            iat: Date.now(),
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.duration,
        }
    );
    res.cookie("authorization", accessToken);
    res.status(200).send({
        success: true,
    });
    return;
}

export async function changeBedValue(req: RequestWithID, res: Response){
    const { changeValue } = req.body as Record<string, any>;
    
    if (!changeValue){
        console.log("No received integer to change bed value with.");
        return;
    }

    const hospitalID = ObjectId(req._id);
    db.collection.updateOne({_id: hospitalID}, { $inc: { availableBeds: changeValue }});
}