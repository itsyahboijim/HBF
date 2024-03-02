import { Request, Response } from 'express';
import { Database } from '../database/database';
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import websiteConfig from '../config/websiteConfig';
import { RequestWithID } from '../types';

const ejs = require('ejs');
const juice = require('juice');
const fs = require("fs");

const { ObjectId } = require('mongodb');
const db = new Database("hospitals");
const emailRegisterDb = new Database("emailRegister");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    }
});

let clients: any[] = [];

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
            validated: profile.validated,
            iat: Date.now(),
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.duration,
        }
    );
    // res.cookie("authorization", accessToken);
    res.status(200).send({
        success: true,
        accessToken,
    });
    return;
}

export async function logout(req: Request, res: Response){
    // res.clearCookie("authorization");
    // res.redirect("/interface/login");
    res.status(200).send({success: true});
}

export async function register(req: Request, res: Response){
    let account = req.body as Record<string, any>;
    const { email, password, name, location, contactNum, maxBeds, availableBeds } = req.body as Record<string, any>;

    res.on("finish", function(){
        if(res.statusCode != 200){
            if(req.file){
                fs.unlink(req.file?.path, (err: any) => {
                    if (err){
                        console.log(`fs unlink - File error: ${err}`);
                    }
                    console.log("Status code is not 200. Uploaded file removed.");
                });
            }
        }
    });

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
    const queryName = `\"${name}\"`;
    const nameExists = await db.collection.findOne({ $text : {$search: queryName}});
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

    // Check if it the email address provided is validated
    const validatedEmails = await emailRegisterDb.collection.find().toArray();
    account.validated = false;
    for (let validEmail of validatedEmails){
        if (validEmail.email == email){
            account.validated = true;
        }
    }

    // Check if there is an uploaded image
    if (req.file){
        account.image = `/images/${req.file.filename}`;
    }
    else {
        account.image = `/images/default.jpeg`;
    }

    account.active = false;
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
    // res.cookie("authorization", accessToken);
    res.status(200).send({
        success: true,
    });

    const mailToken = jwt.sign(
        {
            id: insertStatus.insertedId.toString(),
        },
        jwtConfig.verificationSecret,
        {
            expiresIn: jwtConfig.duration,
        }
    );
    const verifyLink = `${websiteConfig.baseUrl}/api/verify?id=${mailToken}`;
    console.log(`Verify email for ${name}: `, verifyLink);
    const emailTemplate = fs.readFileSync(`${__dirname}/../../views/emailTemplate.ejs`, "utf-8");
    const renderedTemplate = ejs.render(emailTemplate, { verifyLink });
    const inlinedTemplate = juice(renderedTemplate);
    transporter.sendMail({
        from: `"Hospital Bed Finder" <hospitalbedfinder@gmail.com>`,
        to: `${email}`,
        subject: "Email verification - Hospital Bed Finder",
        html: inlinedTemplate,
    });

    return;
}

export async function changeBedValue(req: RequestWithID, res: Response){
    const { changeValue } = req.body as Record<string, any>;
    
    if (!changeValue){
        console.log("No received integer to change bed value with: " + changeValue);
        return;
    }

    const hospitalID = ObjectId(req._id);
    db.collection.updateOne({_id: hospitalID}, { $inc: { availableBeds: changeValue }});
    res.status(200).send({
        success: true,
    });

    const hospitalData = await db.collection.findOne({_id: hospitalID});
    if(hospitalData?.validated){
        const updateObj = {
            mode: "update",
            _id: hospitalID,
            changeValue: changeValue,
        }
        sendHospitalUpdates(updateObj);
    }

    return;
}

export async function streamHospitalUpdates(req: Request, res: Response){
    const headers = {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-store",
    }
    res.writeHead(200, headers);

    const clientID = Date.now();
    const clientObj = {
        id: clientID,
        res,
    };
    clients.push(clientObj);
    console.log(`${clientID}: Connection established.`);

    req.on("close", () => {
        clients = clients.filter(client => client.id !== clientID);
        console.log(`${clientID}: Connection closed.`);
    });
}

async function sendHospitalUpdates(updateData: any){
    for (let client of clients){
        client.res.write(`data: ${JSON.stringify(updateData)}\n\n`);
    }
    console.log(`Sent update: `, updateData);
}

export async function registerEmail(req: Request, res: Response){
    const { email } = req.body as Record<string, any>;
    const registerObj = {
        email,
        validatedOn: Date.now(),
    };
    const statusCheck = await emailRegisterDb.collection.findOne({email: email});
    if (statusCheck){
        res.status(400).send({
            success: false,
            error: "Email is already registered",
        });
        return;
    }

    const accountCheck = await db.collection.findOne({email: email});
    if (accountCheck){
        const duplicateCheck = await db.collection.findOne({name: accountCheck.name, validated: true});
        if (duplicateCheck){
            res.status(400).send({
                success: false,
                error: "Name is a duplicate of a validated hospital",
            });
            return;
        }
    }

    emailRegisterDb.collection.insertOne(registerObj);
    const emailFound = await db.collection.updateOne({email, validated: false}, {$set: {validated: true}});
    if (emailFound.matchedCount > 0){
        const account = await db.collection.findOne({email: email});
        if (account && account.active){
            delete account.email;
            delete account.password;
            account.mode = "add";
            sendHospitalUpdates(account);
        }
    }

    res.status(200).send({
        success: true,
    });
    return;
}

export async function verifyEmail(req: Request, res: Response){
    const idToken: any = req.query.id;
    let id: any;

    if(!idToken){
        res.status(400).send({
            success: false,
            error: "No ID provided in query!",
        });
        // res.redirect("/interface/account");
        return;
    }

    jwt.verify(
        idToken, 
        jwtConfig.verificationSecret, 
        (e: any, decoded: any) => {
            if (e){
                console.log(e);
                // res.clearCookie("authorization");
                res.status(400).send({
                    success: false,
                    error: "Something went wrong. Please try again.",
                });
                // res.redirect("/interface/account");
                return;
            }

            id = decoded.id;
        }
    );
    
    const updateStatus = await db.collection.updateOne({_id: ObjectId(id), active: false}, {$set: {active: true}});
    if (updateStatus.matchedCount == 0){
        return;
    }

    const updatedProfile = await db.collection.findOne({_id: ObjectId(id)});
    if(updatedProfile && updatedProfile.validated){
        delete updatedProfile.email;
        delete updatedProfile.password;
        updatedProfile.mode = "add";
        sendHospitalUpdates(updatedProfile);
    }

    const accessToken = jwt.sign(
        {
            _id: id,
            validated: updatedProfile?.validated,
            iat: Date.now(),
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.duration,
        }
    );
    // res.cookie("authorization", accessToken);
    res.status(200).send({verify: true});
    return;
}

export async function editProfile(req: RequestWithID, res: Response){
    // Check if there is data in all fields
    const { name, location, contactNum, maxBeds } = req.body as Record<string, any>;
    if (!name || !location || !contactNum || !maxBeds){
        res.status(400).send({
            success: false,
            field: "request",
            error: "Please fill in all fields.",
        });
        return;
    }

    // Check if there is a hospital with the same name
    const queryName = `\"${name}\"`;
    const nameQueryHospitals = await db.collection.find({ $text : {$search: queryName}}).limit(2).toArray();
    for (let i = 0; i < nameQueryHospitals.length; i++) {
        if (req._id != nameQueryHospitals[i]._id.toString() && name.toUpperCase() == nameQueryHospitals[i].name.toUpperCase() && nameQueryHospitals[i].validated){
            res.status(400).send({
                success: false,
                field: "name",
                error: "There is already a validated hospital with this name.",
            });
            return;
        }
    }
    
    // Check if a profile could be queried with the cookie
    const hospitalID = ObjectId(req._id);
    const baseProfile = await db.collection.findOne({_id: hospitalID});
    if (!baseProfile){
        res.status(404).send({
            success: false,
            field: "request",
            error: "Something went wrong.",
        });
        // res.clearCookie("authorization");
        return;
    }

    // Construct object to hold updated fields
    const profileUpdates: Record<string, any> = {};
    const newProfile = req.body as Record<string, any>;
    let keys = Object.keys(newProfile);
    keys.forEach(key => {
        if (newProfile[key] != baseProfile[key]){
            if (key == "maxBeds"){
                profileUpdates[key] = parseInt(newProfile[key]);
            }
            else {
                profileUpdates[key] = newProfile[key];
            }
        }
    });

    // Check if maxBeds is updated and if it is less than the available bed count
    if (profileUpdates.maxBeds && profileUpdates.maxBeds < baseProfile.availableBeds){
        profileUpdates.availableBeds = profileUpdates.maxBeds;
    }
    
    if (Object.keys(profileUpdates).length > 0){
        await db.collection.updateOne({_id: hospitalID}, {$set: profileUpdates});
    }

    profileUpdates.mode = "edit";
    profileUpdates._id = req._id;
    sendHospitalUpdates(profileUpdates);
    
    res.status(200).send({
        success: true,
    });
    return;
}

export async function editProfilePicture(req: RequestWithID, res: Response){
    const hospitalID = ObjectId(req._id);
    const imagePath = `/images/${req.file?.filename}`;

    await db.collection.updateOne({_id: hospitalID}, {$set: {image: imagePath}});
    
    res.status(200).send({
        success: true,
    });

    const profileImage = {
        mode: "image",
        _id: req._id,
        image: imagePath,
    };

    sendHospitalUpdates(profileImage);
    return;
}