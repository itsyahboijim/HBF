import { Request, Response } from 'express';

export function parseCookies(req: Request, res: Response, next: Function){
    const cookies = (req.headers.cookie || "").split("; ") || [];
    if (cookies){
        const cookiesObj: Record<string, any> = {};
        for (const cookie of cookies){
            const key = cookie.split("=")[0];
            const value = cookie.split("=").slice(1).join("=");
            cookiesObj[key] = value;
        }
        req.cookies = cookiesObj;
    }
    next();
}