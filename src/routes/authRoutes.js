import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router()
const salt = Number(process.env.SALT)

//Register Users
router.post("/register", (req, res) => {
    const {username, password} = req.body

    if(!username ||!password) return res.status(400).send("Username and password are required")

    //check if user exists
    const getUser = db.prepare("SELECT COUNT(*) as count FROM USERS WHERE username = ?")
    const user = getUser.get(username)
    if(user.count > 0) return res.status(400).send({ message:"Username already exists"})

    const hashedPassword = bcrypt.hashSync(password, salt)

    try{

        //create user
        const insertUser = db.prepare(`INSERT INTO USERS (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        const defaultTodo = `Hello :) first todo`

        //create default task
        const insertTodo = db.prepare(`INSERT INTO TODOS (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        const token = jwt.sign(
            {id: result.lastInsertRowid}, 
            process.env.JWT_SECRET, 
            {expiresIn: "24h"}
        )

        res.status(201).send({token})

    }catch(error){
        console.error(error.message)
        return res.sendStatus(503)
    }

})

router.post("/login", (req, res) => {
    const {username, password} = req.body

    try{
        //Check if the user exists
        //const getUser = db.prepare("SELECT EXISTS (SELECT 1 FROM USERS WHERE username = ?) AS userCount")
        //const getUser = db.prepare(`SELECT COUNT(*) AS count FROM USERS WHERE username = ?`)
        //const getUser = db.prepare("SELECT id password FROM USERS WHERE username = ?")
 
        const getUser = db.prepare(`SELECT id, password FROM USERS WHERE username = ?`) 
        const user = getUser.get(username)
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
        return res.sendStatus(503)
    }
})

export default router