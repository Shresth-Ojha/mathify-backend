import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import ProjectError from '../helper/error';
import { ResultResponse } from '../utils/interfaces';

const registerUser: RequestHandler = async (req, res, next) => {
    let resp: ResultResponse;

    try {
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
    } catch (error) {
        next(error);
    }
};

const loginUser: RequestHandler = async (req, res, next) => {
    let resp: ResultResponse;

    try {
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
                    { userId: user._id },
                    'reallysecretkey',
                    { expiresIn: '1h' }
                );

                res.cookie('jwttoken', token);

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
    } catch (error) {
        next(error);
    }
};

export { registerUser, loginUser };
