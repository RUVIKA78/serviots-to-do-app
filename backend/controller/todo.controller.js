import ToDo from "../models/todo.model.js";

const fetchTask = async (req, res) => {
    try {
        const data = await ToDo.find().sort({ createdAt: -1 });
        console.log(data);

        return res.status(200).json({ success: true, message: "all todos", data });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error })
    }
}
const addTask = async (req, res) => {
    const { todoName, isCompleted } = req.body;
    if (!todoName) {
        return res.status(400).json({ error: 'todoName is required' });
    }
    try {
        const createToDo = await ToDo.create({ todoName, isCompleted })
        console.log(createToDo);

        return res.status(200).json({ success: true, message: "todo added", createToDo })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, message: "error occured" })
    }
}
const editTask = async (req, res) => {
    const { id } = req.params;
    const { todoName, isCompleted } = req.body;
    const editToDo = await ToDo.findByIdAndUpdate(
        id,
        { todoName, isCompleted },
        { new: true }
    )

    return res.status(200).json({ success: true, editToDo })
}
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await ToDo.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "todo deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(400).json({error})
    }
}

const searchTask = async (req,res) => {
    try {
        const { query } = req.body;
        
        const tasks = await ToDo.find({ todoName: { $regex: query, $options: 'i' } })
        res.status(200).json({ success: true, tasks: tasks });
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,error})
        
    }
}
export { fetchTask, addTask, editTask, deleteTask, searchTask }