import React, { useEffect, useState } from "react";
import { NewTodoForm } from "./NewTodoForm";
import { TodoList } from "./TodoList.jsx";
import axios from "axios";

const TodoPage = () => {
    const [data, setData] = useState("");
    const getData = async () => {
        const response = await axios.get("http://localhost:8080/getData");
        setData(response.data); //TODO:GEREKSIZ GIBI
    };

    useEffect(() => {
        getData();
    }, []);

    const [todos, setTodos] = useState(() => {
        const localValue = localStorage.getItem("ITEMS");
        if (localValue === null) {
            return [];
        }
        return JSON.parse(localValue);
    });

    useEffect(() => {
        localStorage.setItem("ITEMS", JSON.stringify(todos));
    }, [todos]);

    function toggleTodo(id, completed) {
        setTodos((currentTodos) => {
            return currentTodos.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, completed };
                }
                return todo;
            });
        });
    }

    function deleteTodo(id) {
        setTodos((currentTodos) => {
            return currentTodos.filter((todo) => todo.id !== id);
        });
    }

    function addTodo(title) {
        setTodos((currentTodos) => {
            return [...currentTodos, { id: crypto.randomUUID(), title, completed: false }];
        });
    }

    return (
        <>
            {/* Your Todo page JSX */}
            <h1>Todo Page</h1>
            <NewTodoForm onSubmit={addTodo} />
            <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        </>
    );
};

export default TodoPage;
