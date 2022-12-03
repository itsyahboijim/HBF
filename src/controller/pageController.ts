import { Response } from "express";
import websiteConfig from "../config/websiteConfig";

export async function testHospitalFeed(req: Request, res: Response){
    res.render("hospitalfeed");
}

export async function testLogin(req: Request, res: Response){
    res.render("account");
}