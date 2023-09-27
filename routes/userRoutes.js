import express from 'express';
import  { submit }  from '../controllers/user-controller.js';
const UserRouter = express.Router();

UserRouter.post('/submit',submit);
UserRouter.get('/',(req,res)=>{
    res.send('get request')
})
export default UserRouter;