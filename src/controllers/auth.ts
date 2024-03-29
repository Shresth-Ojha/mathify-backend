import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import ProjectError from '../helper/error';
import { ResultResponse } from '../utils/interfaces';

const registerUser: RequestHandler = asyncHandler(async (req, res, next) => {
    let resp: ResultResponse;
    const name = req.body.name;
    const email = req.body.email;
    const passFromReq = req.body.password;

    const password = await bcrypt.hash(passFromReq, 12);

    const user = new User({ name, email, password });
    const result = await user.save();
    if (!result) {
        resp = {
            status: 'error',
            message: 'No result found',
            data: {},
        };

        res.send(resp);
    } else {
        resp = {
            status: 'success',
            message: 'Registered!',
            data: { userId: result._id },
        };
        res.send(resp);
    }
});

const loginUser: RequestHandler = asyncHandler(async (req, res, next) => {
    let resp: ResultResponse;
    const email = req.body.email;
    const passFromReq = req.body.password;
    const user = await User.findOne({ email });

    if (!user) {
        const err = new ProjectError(
            `User with the mail ${email} doesn't exist`
        );
        err.statusCode = 401;
        throw err;
    } else {
        const passFromDB = user.password;
        const match = await bcrypt.compare(passFromReq, passFromDB);
        if (match) {
            const token = jwt.sign(
                { userId: user._id, name: user.name },
                'reallysecretkey',
                { expiresIn: '1h' }
            );

            res.cookie('jwttoken', token, {
                path: '/',
                sameSite: 'none',
                httpOnly: false, //true -> document.cookie wont return cookie on client-side js
                secure: true, //true -> only sent when the URL begins with https://
                maxAge: 3600000, // 1 hour
                // domain: 'https://localhost:5173',
            });

            resp = {
                status: 'success',
                message: `Password Matched!`,
                data: { token, name: user.name, email: user.email },
            };
            res.send(resp);
        } else {
            const err = new ProjectError(`Password didn't match.`);
            err.statusCode = 401;
            throw err;
        }
    }
});

export { registerUser, loginUser };
