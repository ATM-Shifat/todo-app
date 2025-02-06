import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {

    try{
        const token = req.headers['authorization'];

        if(!token) return res.status(401).send('No Token Provided');

        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(err) return res.status(401).json({ mesage: "Invalid Token"})
            
            req.userId = decode.id
            
            next()
        })
    }catch(error){
        console.error(error.message)
        res.status(500).send('Server Error')
    }

}

export default authMiddleware;

