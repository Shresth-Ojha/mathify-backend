import { RequestHandler } from 'express';

import User from '../models/user';
import ProjectError from '../helper/error';

import { ResultResponse } from '../utils/interfaces';

const getUser: RequestHandler = async (req, res, next) => {
    let resp: ResultResponse;
    console.log('woahh! passed the authentication middleware');

    try {
        let userId = req.body.userId;

        if(userId){

            if (req.userId != userId) {
                const err = new ProjectError('Please apni hi ID maange');
                err.statusCode = 401;
                throw err;
            }
        }
        else {
            userId = req.userId.toString();
        }


        const user = await User.findById(userId, { name: 1, email: 1 });

        if (!user) {
            const err = new ProjectError(`User with id ${userId} not found`);
            err.statusCode = 401;
            throw err;
        } else {
            resp = {
                status: 'success',
                message: `User Found!`,
                data: { user },
            };
            res.status(200).send(resp);
        }
    } catch (error) {
        next(error);
    }
};

const updateUser: RequestHandler = async (req, res, next) => {
    let resp: ResultResponse;

    try {
        const userId = req.body._id;

        if (req.userId != userId) {
            const err = new ProjectError('Please apni hi ID ko update kare');
            err.statusCode = 401;
            throw err;
        }

        const user = await User.findById(userId);
        if (!user) {
            const err = new ProjectError(`User not found`);
            err.statusCode = 401;
            throw err;
        } else {
            user.name = req.body.name;
            await user.save();
            resp = {
                status: 'success',
                message: `User updated`,
                data: {},
            };
            res.status(200).send(resp);
        }
    } catch (error) {
        next(error);
    }
};

const logoutUser:RequestHandler = async (req,res,next) => {
    let resp: ResultResponse;

    try {
        res.clearCookie('jwttoken');
        console.log('ran')
        resp = {
            status: 'success',
            message: `User logged out`,
            data: {},
        };
        res.status(200).send(resp)
    } catch (error) {
        next(error)
    }
}

export { getUser, updateUser, logoutUser };
