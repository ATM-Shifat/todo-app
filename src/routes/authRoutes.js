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
    // const user = db.query("SELECT * FROM USERS WHERE username = ?", [username])

    // console.log(user)

    //if(user) return res.status(400).send("Already an user")



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
            process.env.JWT_SECRETE, 
            {expiresIn: "24h"}
        )


        // res.json({token})
        // res.status(201)

        res.status(201).send({token})

    }catch(error){
        console.error(error)
        return res.sendStatus(503)
    }

})

router.post("/login", (req, res) => {
    res.sendStatus(200)
})

export default router