import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";

const Todo = () => {
    const [todoName, setToDoName] = useState('');
    const [todos, setTodos] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editedTodo, setEditedTodo] = useState('');
    const [query, setQuery] = useState('');

    const backendUrl=import.meta.env.VITE_BASE_URL
    
    

    useEffect(() => {
        fetchTasks();
    }, [])

    const togglecheckBox = async (id, isCompleted) => {
        try {
            const { data } = await axios.put(`${backendUrl}/tasks/${id}`, {
                isCompleted: !isCompleted, // Toggle completion status
            });
            setTodos(todos.map(todo => (todo._id === id ? { ...todo, isCompleted: !isCompleted } : todo)));
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${backendUrl}/tasks`);
            
            setTodos(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const addTask = async (e) => {
        e.preventDefault();
        if (todoName.length === 0) return;

        const response = await axios.post(`${backendUrl}/tasks`,

            { todoName, isCompleted: false }
        )

        console.log(response.data);
        

        setTodos([...todos, response.data])
        setToDoName('');
        // fetchTasks();


    }
    const updateTask = async (id) => {
        const { data } = await axios.put(`${backendUrl}/tasks/${id}`, {
            id,
            todoName: editedTodo,
        });
        setTodos(todos.map((todo) => (todo._id === id ? { ...todo, todoName: editedTodo } : todo)))
        setEditing(null);
        setEditedTodo('');
        fetchTasks();
        return data;
    }
    const deleteTask = async (id) => {
        await axios.delete(`${backendUrl}/tasks/${id}`);
        setTodos(todos.filter((todo) => todo._id !== id));
    }

    const searchTasks = async (e) => {
        e.preventDefault();
        if (query.trim() === '') {
            fetchTasks();
            return;
        }        
        try {
            const response = await axios.post(`${backendUrl}/search`,
                { query },
                { headers: { 'Content-Type': 'application/json' } }

            );

            const filteredTasks = response.data.tasks.filter((task) =>
                task.todoName.toLowerCase().includes(query.toLowerCase())
            );
            setTodos(filteredTasks);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex w-full h-screen justify-center items-center bg-gradient-to-r from-orange-200 via-biege-200 to-pink-300'>
            <div className='flex flex-col justify-center items-center bg-slate-100 px-5 py-10 rounded-3xl shadow-black-300 shadow-xl'>
                <h1 className='mt-4 mb-8 text-2xl lg:text-5xl font-medium text-center'>This is a To Do App</h1>
                <div>
                    <form  onSubmit={(e) => addTask(e)}  className='sm:flex items-center gap-2'>
                        <input className='text-2xl rounded-3xl outline-none border-2 border-blue-600 px-2 py-1' type="text" value={todoName} onChange={(e) => setToDoName(e.target.value)} name='todoName' placeholder='write here..' />
                        <div className='flex justify-center mt-3 sm:mt-0 sm:flex gap-2'>
                        <button className='px-3 py-1 bg-blue-600 rounded-full font-semibold text-white' type='submit' ><FaPlus /></button>
                        <button
                            className='px-3 py-1 bg-blue-600 rounded-full font-semibold text-white'
                            type='submit'
                            onClick={(e) => {
                                setQuery(todoName);
                                searchTasks(e);
                            }} ><FaSearch />
                        </button>
                        <button className='px-3 py-1 bg-blue-600 rounded-full font-semibold text-white' type='submit' onClick={() => fetchTasks()} ><TbRefresh/></button>

                        </div>
                      
                    </form>
                </div>

                <div className='flex items-start mt-4 flex-col'>
                    {todos.length > 0 && todos.map((todo) => (
                        <div key={todo._id}>
                            {editing === todo._id ? (
                                <div>
                                    <input
                                        className='text-md rounded-2xl outline-none border-2 border-blue-600 px-2 py-1'
                                        placeholder={editedTodo}
                                        type="text"
                                        value={editedTodo}
                                        onChange={(e) => setEditedTodo(e.target.value)}
                                    />
                                    <button onClick={() => updateTask(todo._id)} className='px-3 py-1 bg-blue-600 rounded-2xl font-semibold text-white' >Save</button>
                                    <button onClick={() => setEditing(null)} className='px-3 py-1 bg-blue-600 rounded-2xl font-semibold text-white' >Cancel</button>
                                </div>
                            ) : (
                                <div className='flex items-center gap-2 border-2 border-black px-2 py-1 rounded-2xl mt-2'>
                                    <input type="checkbox" name="isCompleted" id="isCompleted" checked={todo.isCompleted} onChange={() => togglecheckBox(todo._id, todo.isCompleted)} />
                                    <p style={{
                                        textDecoration: todo.isCompleted ? 'line-through' : 'none',
                                        color: todo.isCompleted ? "green" : "red"
                                    }}>{todo.todoName}</p>
                                    <MdEdit onClick={() => {
                                        setEditing(todo._id);
                                        setEditedTodo(todo.todoName);
                                    }} />
                                    <MdDelete onClick={() => deleteTask(todo._id)} />
                                </div>
                            )}
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}

export default Todo
