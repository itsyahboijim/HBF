import { Request } from 'express';

export interface RequestWithID extends Request{
    _id: string;
}