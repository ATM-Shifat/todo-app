import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';


const router = express.Router()


router.get("/", (req, res) => {
    const getTodos = db.prepare(`SELECT * FROM TODOS WHERE user_id = ?`)
    const todos = getTodos.all(req.userId)

    if(!todos) return res.status(404).json({message: "Not Found"})

    res.status(200).json(todos)
})

router.post("/", (req, res) => {

    const {task} = req.body

    if(task.lenght < 1) return res.status(401).json({message: "Task cannot be emty"})

    try{
        const addTask = db.prepare(`INSERT INTO TODOS (user_id, task) VALUES (?, ?)`)
        const result = addTask.run(req.userId, task)

        res.status(201).json({ id: result.lastInsertRowid, task,message: "Task created successfully"})

    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: "Server Error"})
    }


})

router.put("/:id", (req, res) => {

    const {id} = req.params
    const {task, completed} = req.body

    try{
        const updateTask = db.prepare(`UPDATE TODOS SET completed = ? WHERE id = ? AND user_id = ?`)
        const result = updateTask.run(completed, id, req.userId)

        if(result.changes === 0) return res.status(404).json({message: "Not Found"})
        
        res.status(200).json({id: id, task, message: "Task updated successfully"})

    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: "Server Error"})
    }
}) 

router.delete("/:id", (req, res) => {
    const {id} = req.params

    try{
        const deleteTask = db.prepare(`DELETE FROM TODOS WHERE id =? AND user_id =?`)
        const result = deleteTask.run(id, req.userId)

        if(result.changes === 0) return res.status(404).json({message: "Not Found"})

        res.status(200).json({message: "Task deleted successfully"})

    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: "Server Error"})
    }
})

export default router