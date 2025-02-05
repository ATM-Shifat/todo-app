import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';


const router = express.Router()


router.get("/", (req, res) => {})

router.post("/", (req, res) => {})

router.put("/:id", (req, res) => {}) 

router.delete("/:id", (req, res) => {})

export default router