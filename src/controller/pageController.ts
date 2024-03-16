import { Request, Response } from "express";
import { Database } from "../database/database";
import { RequestWithID } from "../types";

const { ObjectId } = require('mongodb');
const db = new Database("hospitals");
const emailRegisterDb = new Database("emailRegister");

export async function hospitalFeed(req: Request, res: Response){
    await db.injectSampleValidatedEmails();
    await db.injectSampleData();
    
    const hospitalInfo = await db.collection.find({validated: true}).toArray();
    const hospitals: Record<string, any> = {};

    for (let hospital of hospitalInfo){
        delete hospital.email;
        delete hospital.password;

        hospitals[hospital._id.toString()] = hospital;
        delete hospitals[hospital._id.toString()]._id;
    }

    // res.render("hospitalfeed", hospitals);
    res.status(200).send({
        success: true,
        hospitals,
    });
    return;
}

export async function login(req: Request, res: Response){
    // res.render("login");
    console.warn("Login interface endpoint called, prevent this from occurring!");
    res.status(404).send({
        message: "This endpoint is currently unavailable",
    });
    return;
}

export async function account(req: RequestWithID, res: Response){
    
    const hospitalID = ObjectId(req._id);
    const hospitalData = await db.collection.findOne({_id: hospitalID});
    
    if (hospitalData){
        if (!hospitalData.active){
            // res.clearCookie("authorization");
            // res.render("verify");
            res.status(400).send({
                success: false,
                error: "No hospital matches request ID",
            })
            return;
        }

        delete hospitalData.email;
        delete hospitalData.password;
    }
    // res.render("account", hospitalData as Object);
    res.status(200).send({
        success: true,
        hospitalData,
    });
    return;
}

// For demonstration purposes
export async function adminValidate(req: Request, res: Response){
    const approvedEmails = await emailRegisterDb.collection.find().toArray();
    let unvalidatedHospitals = await db.collection.find().toArray();
    unvalidatedHospitals = unvalidatedHospitals.filter(hospital => !hospital.validated);

    for (let hospital of unvalidatedHospitals){
        delete hospital.password;
    }

    // res.render("adminValidate", {
    //     approvedEmails,
    //     unvalidatedHospitals,
    // });
    res.status(200).send({
        success: true,
        approvedEmails,
        unvalidatedHospitals,
    });
    return;
}