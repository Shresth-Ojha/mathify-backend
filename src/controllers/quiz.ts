import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';

import Quiz from '../models/quiz';
import ProjectError from '../helper/error';

import { ResultResponse } from '../utils/interfaces';

const createQuiz: RequestHandler = asyncHandler(async (req, res, next) => {
    const created_by = req.userId;
    const author = req.username;
    const name = req.body.name;
    const questions = req.body.questions;
    const answers = req.body.answers;

    const quiz = new Quiz({ name, questions, answers, created_by, author });
    const result = await quiz.save();

    const resp: ResultResponse = {
        status: 'success',
        message: 'quiz created succesfully',
        data: { quizId: result._id },
    };

    res.status(201).send(resp);
});

const getQuiz: RequestHandler = asyncHandler(async (req, res, next) => {
    let quiz;
    const quizId = req.params.quizId;
    if (quizId) {
        // single quiz
        quiz = await Quiz.findById(quizId, {
            created_by: 0,
        });
        if (!quiz) {
            const err = new ProjectError(`Quiz with this Id does'nt exist`);
            err.statusCode = 404;
            throw err;
        }
    } else {
        // all quizzes
        quiz = await Quiz.find({}, { created_by: 0 });
        if (!quiz) {
            const err = new ProjectError('No quiz found');
            err.statusCode = 404;
            throw err;
        }
    }
    const resp: ResultResponse = {
        status: 'success',
        message: 'quiz found',
        data: quiz,
    };
    res.status(200).send(resp);
});

const updateQuiz: RequestHandler = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const quizId = req.body._id;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        const err = new ProjectError(`Quiz with this Id does'nt exist`);
        err.statusCode = 404;
        throw err;
    }

    if (userId !== quiz.created_by.toString()) {
        const err = new ProjectError("You can't update other's quizzes");
        err.statusCode = 401;
        throw err;
    }

    if (quiz.is_published) {
        const err = new ProjectError("Can't update published quizes");
        err.statusCode = 405;
        throw err;
    }

    quiz.name = req.body.name;
    quiz.questions = req.body.questions;
    quiz.answers = req.body.answers;

    await quiz.save();
    const resp: ResultResponse = {
        status: 'success',
        message: 'quiz updated',
        data: { updatedQuiz: quiz },
    };
    res.status(200).send(resp);
});
const deleteQuiz: RequestHandler = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        const err = new ProjectError(`Quiz with this Id does'nt exist`);
        err.statusCode = 404;
        throw err;
    }

    if (userId !== quiz.created_by.toString()) {
        const err = new ProjectError("You can't delete other's quizzes");
        err.statusCode = 401;
        throw err;
    }

    if (quiz.is_published) {
        const err = new ProjectError("Can't delete published quizes");
        err.statusCode = 405;
        throw err;
    }

    await Quiz.deleteOne({ _id: quizId });
    const resp: ResultResponse = {
        status: 'success',
        message: 'quiz deleted',
        data: {},
    };
    res.status(200).send(resp);
});
const publishQuiz: RequestHandler = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const quizId = req.body._id;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        const err = new ProjectError(`Quiz with this Id does'nt exist`);
        err.statusCode = 404;
        throw err;
    }

    if (userId !== quiz.created_by.toString()) {
        const err = new ProjectError("You can't publish other's quizzes");
        err.statusCode = 401;
        throw err;
    }

    if (quiz.is_published) {
        const err = new ProjectError('Already published!');
        err.statusCode = 405;
        throw err;
    }

    quiz.is_published = true;
    await quiz.save();
    const resp: ResultResponse = {
        status: 'success',
        message: `quiz published! you can't update or delete it now`,
        data: {},
    };
    res.status(200).send(resp);
});

export { createQuiz, getQuiz, updateQuiz, deleteQuiz, publishQuiz };
