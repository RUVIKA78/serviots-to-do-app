import mongoose from "mongoose";

const todo = new mongoose.Schema({
    todoName: {
        type:String,
        required: [true,'task name is required'],
        trim: true,
    },
    isCompleted: {
        type: Boolean,
        default:false
    },
}, { timestamps: true })

const ToDo = new mongoose.model("ToDo", todo);

export default ToDo;