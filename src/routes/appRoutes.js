import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';


const router = express.Router()


router.get("/", async (req, res) => {
    
    //Get the user's task list
    const todos = await prisma.todo.findMany({
        where:{
            userId: req.userId
        }
    })

    res.status(200).json(todos)
})

router.post("/", async (req, res) => {

    const {task} = req.body

    if(task.lenght < 1) return res.status(401).json({message: "Task cannot be emty"})

    try{

        //Create task
        const todo = await prisma.todo.create({
            data: {
                userId: req.userId,
                task: task
            }
        })

        res.status(201).json({ todo, message: "Task created successfully"})

    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: "Server Error"})
    }


})

router.put("/:id", async (req, res) => {

    const {id} = req.params
    const {task, completed} = req.body

    //Checking provided information
    if(!task ||!completed) return res.status(400).send("Missing task or completed information!")

    try{
        const updatedTodo = await prisma.todo.update({
            where: {
                id: parseInt(id),
                userId: req.userId
            },
            data: {
                task: task,
                completed: !!completed,
            }
        })
        
        res.status(200).json({updatedTodo, message: "Task updated successfully"})

    }catch(error){

        // Prisma error code for "Record not found"
        if(error.code === 'P2025') return res.status(404).json({message: "Task not found!"})

        console.error(error.message)
        return res.status(500).json({message: "Server error"})
    }
}) 

router.delete("/:id", async (req, res) => {
    const {id} = req.params

    try{
        
        const deleteTodo = await prisma.todo.delete({
            where: {
                id: parseInt(id),
                userId: req.userId
            }
        })

        res.status(200).json({message: "Task deleted successfully"})

    }catch(error){

        // Prisma error code for "Record not found"
        if(error.code === 'P2025') return res.status(404).json({message: "Task not found!"})

        console.error(error.message)
        return res.status(500).json({message: "Server error"})
    }
})

export default router