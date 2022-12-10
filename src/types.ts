import { Request } from 'express';
import { ObjectId } from 'mongodb';

export interface RequestWithID extends Request{
    _id: ObjectId;
}