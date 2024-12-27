import express from "express";
import todoRouter from "./routes/todo.route.js"
import { config } from "dotenv";
import cors from 'cors'
import connectDB from "./db.js";

//initilize app
const app = express();
//environment variable setup
config();

//mongodb function
connectDB()
//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes setup
app.use('/api', todoRouter)
app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening');
    
})

export default app;
