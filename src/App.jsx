import "./styles.css"
import {useEffect, useState} from "react";
import {NewTodoForm} from "./NewTodoForm"
import {TodoList} from "./TodoList.jsx";
import Register from "./Register.jsx"
import Login from "./Login.jsx";
import axios from "axios";
import AuthProvider from "./backend/AuthProvider.jsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {

    const [data, setData] = useState("");
    const getData=async()=>{
        const response = await axios.get("http://localhost:8080/getData");
        setData(response.data);
    }
    useEffect(() => {
        getData()
    }, []);
    const [todos, setTodos] = useState(
        ()=>{
            const localValue=localStorage.getItem("ITEMS")
            if(localValue===null){return []}
            return JSON.parse(localValue)
        }
    )

    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user authentication status
    useEffect(() => {
        localStorage.setItem("ITEMS", JSON.stringify(todos))
    }, [todos]);
    function toggleTodo(id,completed){
        setTodos(currentTodos=>{
            return currentTodos.map(todo=>{
                if(todo.id===id){
                    return {...todo,completed}
                }
                return todo
            })
        })
    }
    function deleteTodo(id){
        setTodos(currentTodos=>{
            return currentTodos.filter(todo=>todo.id !== id)
        })
    }
    function addTodo(title){
        setTodos(currentTodos=>{
            return[
                ...currentTodos,{id:crypto.randomUUID(),title,completed:false},
            ]
        })
    }
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />}></Route>

            </Routes>
        </BrowserRouter>
            <NewTodoForm onSubmit={addTodo}/>
        </>
    )
}
