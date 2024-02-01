import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import ProjectError from '../helper/error';
import mongoose from 'mongoose';

const isAuthenticated: RequestHandler = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            const err = new ProjectError('Error in getting token.');
            err.statusCode = 401;
            throw err; //auth header hi nahi hai => login kiya hi nahi
        }
        const token = authHeader.split(' ')[1];

        const decodedToken: { userId: String; name:String, iat: Number; exp: Number } = <
            any
        >jwt.verify(token, 'reallysecretkey');

        if (!decodedToken) {
            const err = new ProjectError('Not authenticated');
            err.statusCode = 401;
            throw err;
        } else {
            req.userId = decodedToken.userId;
            req.username = decodedToken.name;
            next();
        }
    } catch (error) {
        next(error);
    }
};

export { isAuthenticated };
