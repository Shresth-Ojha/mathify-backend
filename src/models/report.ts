import mongoose, { mongo } from 'mongoose';

//schema
const reportSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        submissions: {
            type: Object,
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

//model
const Report = mongoose.model('Report', reportSchema);

export default Report;
