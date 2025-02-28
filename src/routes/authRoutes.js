import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router()
const salt = Number(process.env.SALT)

//Register Users
router.post("/register", async(req, res) => {
    const {username, password} = req.body

    //Checking provided information
    if(!username ||!password) return res.status(400).send("Username and password are required")

    //check if user exists
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if(user) return res.status(409).send({message: "User already exists!"})

    const hashedPassword = bcrypt.hashSync(password, salt)

    try{

        //create user
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        })

        const defaultTodo = `Hello :) first todo`

        //Insert default task
        await prisma.todo.create({
            data: {
                userId: user.id,
                task: defaultTodo,
            }
        })
        
        //Generation of JWT token
        const token = jwt.sign(
            {id: user.id}, 
            process.env.JWT_SECRET, 
            {expiresIn: "24h"}
        )

        res.status(201).send({token})

    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: "Server error"})
    }

})

router.post("/login", async (req, res) => {
    const {username, password} = req.body

    //Checking provided information
    if(!username ||!password) return res.status(400).send("Username and password are required")

    try{

        //Check if the user exists
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if(!user) return res.status(404).send({message: "User not found!"})
        
        //Check password
        const validPassword = bcrypt.compareSync(password, user?.password)
        if(!validPassword) return res.status(401).send({message: "Invalid email or password!"})
        
        const token = jwt.sign(
            {id: user?.id},
            process.env.JWT_SECRET, 
            {expiresIn: "24h"}
        )

        res.status(200).send({token: token})

    }catch(error){
        console.error(error.message)
        return res.status(500).json({message: "Server error"})
    }
})

export default router