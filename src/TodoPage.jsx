import React, { useEffect, useState, useContext } from "react";
import { NewTodoForm } from "./NewTodoForm";
import { TodoList } from "./TodoList.jsx";
import axios from "axios";
import AuthContext from "./backend/AuthProvider.jsx";

const TodoPage = () => {
    const { auth } = useContext(AuthContext);
    const [todos, setTodos] = useState([]);

    const fetchTodos = async () => {
        try {
            const response = await axios.get("http://localhost:3500/todo", {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
            // Handle specific error cases
            if (error.response) {
                // Request was made and server responded with status other than 2xx
                console.error("Server error:", error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                console.error("No response received:", error.request);
            } else {
                // Something else happened in making the request
                console.error("Error:", error.message);
            }
        }
    };


    useEffect(() => {
        fetchTodos();
    }, []);

    const addTodo = async (title) => {
        try {
            const newTodo = {
                user_id: auth.id,
                title,
                description: "",
                status: "pending",
                created_at: null,
                completed_at: null,
            };
            console.log(auth.accessToken);
            const response = await axios.post(
                "http://localhost:3500/todo",
                newTodo,
                {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const insertId = response.data.insertId;
            setTodos((prevTodos) => [...prevTodos, { ...newTodo, id: insertId }]);
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const toggleTodo = async (id, completed) => {
        try {
            const updatedTodos = todos.map((todo) =>
                todo.id === id ? { ...todo, completed } : todo
            );
            setTodos(updatedTodos);
            await axios.put(`http://localhost:3500/todo/${id}`, { ...updatedTodos.find(todo => todo.id === id), status: completed ? "completed" : "pending" });
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            console.log(`Deleting todo with id: ${id}`);
            setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));

            await axios.delete(`http://localhost:3500/todo/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error deleting todo:", error);
            // Handle specific error cases
            if (error.response) {
                // Request was made and server responded with status other than 2xx
                console.error("Server error:", error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                console.error("No response received:", error.request);
            } else {
                // Something else happened in making the request
                console.error("Error:", error.message);
            }
        }
    };

    return (
        <>
            <h1>Simple To-Do App</h1>
            <NewTodoForm onSubmit={addTodo} />
            <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        </>
    );
};

export default TodoPage;
