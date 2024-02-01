import mongoose, { mongo } from 'mongoose';

const quizSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        questions: [
            {
                question_no: {
                    type: Number,
                    required: true,
                },
                question_type: {
                    type: String,
                    enum: ['min/max', 'match', 'input'],
                    required:true
                },
                question_text: {
                    type:String,
                    required:true
                },
                options: [String]
            },
        ],
        answers: {
            type: Object,
            required: true
        },
        created_by: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        is_published: {
            type:Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
