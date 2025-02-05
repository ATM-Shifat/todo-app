import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router()

router.post("/register", (req, res) => {
    res.send(200)
})

router.post("/login", (req, res) => {res.send(204)})

export default router