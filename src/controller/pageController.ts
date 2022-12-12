import { Request, Response } from "express";
import { Database } from "../database/database";
import { RequestWithID } from "../types";

const { ObjectId } = require('mongodb');
const db = new Database("hospitals");

export async function hospitalFeed(req: Request, res: Response){
    await db.injectSampleData();
    const hospitalInfo = await db.collection.find().toArray();

    for (let hospital of hospitalInfo){
        delete hospital.email;
        delete hospital.password;
    }

    const hospitals = { hospitals: hospitalInfo };
    res.render("hospitalfeed", hospitals);
}

export async function login(req: Request, res: Response){
    res.render("login");
}

export async function account(req: RequestWithID, res: Response){
    const hospitalID = ObjectId(req._id);
    const hospitalData = await db.collection.findOne({_id: hospitalID});
    res.render("account", hospitalData as Object);
}