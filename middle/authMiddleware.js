import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//protected routes token base
const JWT_Secret = '$JF0E92$';
export const requireSignIn = async (req,res,next) => {
   
    try{
        const decode = JWT.verify(req.headers.authorization,JWT_Secret);
        req.user = decode
        console.log(req.user._id);
        next();
    } catch(error) {
        console.log(error)
        res.status(401).send({ success: false, message: 'Unauthorized' });
    }
}
//admin access
export const isAdmin = async(req,res,next) => {
    try{
        const user = await userModel.findById(req.user._id)
        if(user.mode !== 1){
            return res.status(401).send({
                success:false,
                message:'unAuthorized Access'
            })
        }
        else {
            next()
        }
    } catch(error){
        console.log(error)
        res.status(401).send({
            success:false,
            error,
            message:"error is admin"
        })
    }
}

// middleware/authMiddleware.js
