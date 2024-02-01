import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import cookieparser from 'cookie-parser'


import userRoute from './routes/user';
import authRoute from './routes/auth';
import quizRoute from './routes/quiz';
import examRoute from './routes/exam';
import reportRoute from './routes/report';
import ProjectError from './helper/error';
import { ResultResponse } from './utils/interfaces';
const app = express();

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || '';

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
};
app.use(cors(corsOptions));
app.use(cookieparser());

// app.use(express.json());
app.use(
    express.json({
        type: ['application/json', 'text/plain'],
    })
);

declare global {
    namespace Express {
        interface Request {
            userId: String;
            username: String
        }
    }
}

app.get('/', (req, res) => {
    res.send("Quizapp backend!");
})

//redirect /user requests to userRoute
app.use('/user', userRoute);
//redirect /auth requests to authRoute
app.use('/auth', authRoute);
//redirect /quiz requests to quizRoute
app.use('/quiz', quizRoute);
//redirect /exam requests to examRoute
app.use('/exam', examRoute);
//redirect /report requests to reportRoute
app.use('/report', reportRoute);


app.use((err: ProjectError, req: Request, res: Response, next: NextFunction) => {
    let message: String;
    let statusCode: number;

    if (err.statusCode && err.statusCode < 500) {
        message = err.message;
        statusCode = err.statusCode;
    } else {
        message = "Something went wrong, try again after sometime."
        statusCode = 500;
    }

    const resp:ResultResponse = {status:"error", message, data: {}}
    if(err.data){
        resp.data = err.data;
    }
    
    console.log(err.statusCode, ' -> ', err.message)
    res.status(statusCode).send(resp);
});

mongoose.connect(DB_CONNECTION_STRING);

mongoose.connection.on('connected', () => {
    console.log("DB connected")
    app.listen(process.env.PORT, () => {
        console.log('Server and DB connected');
    });
});
mongoose.connection.on('error', (error) => {
    console.log(error);
});
