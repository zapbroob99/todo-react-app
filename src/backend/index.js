import express from "express";
import cors from "cors";
import mysql from "mysql2";
import 'dotenv/config'
import axios from 'axios';
import { useContext, createContext } from "react";


const connection = mysql.createConnection({ //connect to db, get values from .env
    host: process.env.HOST,
    user: 'root',
    password: process.env.PW,
    port: process.env.PORT,
    database:process.env.DATABASE,
})


connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

});


const app = express();
app.use(cors());

app.get("/getData", (req, res) => {
    res.send("hello");
})

app.listen(8080, () => console.log("Server is running on port: 8080."));