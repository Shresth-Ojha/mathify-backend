import express from 'express';
import { getUser, updateUser, logoutUser } from '../controllers/user';
import {isAuthenticated} from '../middlewares/isAuth';

const router = express.Router();


//user should be authenticated
//user should be authorized
//GET /user/:userId
router.get('/', isAuthenticated, getUser)

//user should be authenticated
//user should be authorized
//PUT /user/
router.put('/', isAuthenticated, updateUser);


//GET /user/logout
router.get('/logout', isAuthenticated, logoutUser);

export default router;