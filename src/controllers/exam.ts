import { RequestHandler } from 'express';

import Quiz from '../models/quiz';
import Report from '../models/report';
import ProjectError from '../helper/error';
import { ResultResponse } from '../utils/interfaces';


const startExam: RequestHandler = async (req, res, next) => {
    try {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findById(quizId, { created_by: 0 });
        if (!quiz) {
            const err = new ProjectError(`Quiz doesn't exist`);
            err.statusCode = 404;
            throw err;
        }

        if (!quiz.is_published) {
            const err = new ProjectError(`Quiz not published yet!`);
            err.statusCode = 405;
            throw err;
        }

        res.send(quiz);
    } catch (error) {
        next(error);
    }
};

const submitExam: RequestHandler = async (req, res, next) => {
    try {
        const quizId = req.body.quizId;
        const userId = req.userId;
        const submissions = req.body.submissions;

        const quiz = await Quiz.findById(quizId, { answers: 1 });
        if (!quiz) {
            const err = new ProjectError("Quiz does'nt exist");
            err.statusCode = 404;
            throw err;
        }

        const answers = quiz.answers;
        const keys = Object.keys(answers);
        const length = keys.length;
        let score = 0;
        const total = 10 * length;

        for (let i = 0; i < length; i++) {
            let qno = keys[i];
            const answer_list = answers[qno];
            const submission_list = submissions[qno];

            if (submission_list) {
                for (let j = 0; j < answer_list.length; j++) {
                    if (submission_list[j] === answer_list[j]) {
                        score += 10 / answer_list.length;
                    }
                }
            }
        }

        const report = new Report({
            quizId,
            userId,
            submissions,
            score,
            total,
        });
        await report.save();

        const resp: ResultResponse = {
            status: 'success',
            message: 'Quiz submitted!',
            data: { report: report },
        };

        res.status(200).send(resp);
    } catch (error) {
        next(error);
    }
};

export { startExam, submitExam };
