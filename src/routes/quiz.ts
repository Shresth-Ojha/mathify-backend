import express from "express";


import { createQuiz, deleteQuiz, getQuiz, publishQuiz, updateQuiz } from "../controllers/quiz";
import { isAuthenticated } from "../middlewares/isAuth";

const router = express.Router();


//
// POST /quiz/ 
router.post('/', isAuthenticated, createQuiz)

// GET /quiz/:quizId
router.get('/:quizId?', isAuthenticated,getQuiz);

// PUT /quiz/
router.put('/', isAuthenticated, updateQuiz);

// DELETE /quiz/:quizId
router.delete('/:quizId', isAuthenticated, deleteQuiz)

// PATCH /quiz/publish
router.patch('/publish', isAuthenticated, publishQuiz);

export default router