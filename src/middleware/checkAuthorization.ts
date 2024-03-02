import { Request, Response } from 'express';
import jwtConfig from '../config/jwtConfig';
import jwt from 'jsonwebtoken';
import { RequestWithID } from '../types';

export async function authenticate(req: Request, res: Response, next: Function){
    const authorization = req.headers.authorization;
    if (!authorization){
        // res.redirect("/interface/login");
        res.status(400).send({
            success: false,
            error: "Something went wrong. Please try again."
        });
        return;
    }
    
    jwt.verify(
        authorization,
        jwtConfig.secret,
        async (err: any, userData: any) => {
            if (err){
                // res.clearCookie("authorization");
                // res.redirect("/interface/login");
                
                res.status(400).send({
                    success: false,
                    error: "Something went wrong. Please try again."
                });
                return;
            }
            (req as RequestWithID)._id = userData._id;
        }
    );
    next();
}