import { Response } from "express";
import websiteConfig from "../config/websiteConfig";
import { Database } from "../database/database";

const db = new Database("hospitals");

export async function hospitalFeed(req: Request, res: Response){
    await db.injectSampleData();
    const hospitalInfo = await db.collection.find().toArray();
    const hospitals = { hospitals: hospitalInfo };
    res.render("hospitalfeed", hospitals);
}

export async function login(req: Request, res: Response){
    res.render("login");
}

export async function account(req: Request, res: Response){
    res.render("account");
}