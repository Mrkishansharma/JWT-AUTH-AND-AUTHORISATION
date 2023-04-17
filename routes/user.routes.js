
const {Router} = require('express');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

require('dotenv').config();


const { UserModel } = require('../models/user.model');

const { BlacklistedModel } = require('../models/blacklisted.model');

const userRouter = Router();


userRouter.post('/register', async (req,res)=>{

    const {Name, Email, Password, Role} = req.body
    
    try {
        
        const userPresent = await UserModel.findOne({Email});

        if(userPresent){
            return res.status(400).send({
                msg:"User already exits"
            })
        }

        const hashPassword = bcrypt.hashSync(Password, 5);

        const newuser = new UserModel({Email, Name, Password:hashPassword, Role});

        await newuser.save();

        return res.status(200).send({
            msg:"Register Successfull",
            user: newuser
        })

    } catch (error) {
        
        return res.status(500).send({error:error.message, msg:"Something went wrong"})

    }

})

userRouter.post('/login', async (req,res)=>{
    
    const { Email, Password } = req.body
    
    try {
        
        const userPresent = await UserModel.findOne({Email});

        if(!userPresent){
            return res.status(400).send({
                msg:"User doesn't exits. Signup first"
            })
        }

        const verifyPassword = bcrypt.compareSync(Password, userPresent.Password);

        if(verifyPassword){

            const accesstoken = jwt.sign({UserID:userPresent._id, Role:userPresent.Role}, process.env.AccessToken, {expiresIn:"1m"});

            const refreshtoken = jwt.sign({UserID:userPresent._id, Role:userPresent.Role}, process.env.RefreshToken, {expiresIn:"3m"});

            res.cookie("AccessToken", accesstoken, {maxAge:1000*60*3})

            res.cookie("RefreshToken", refreshtoken, {maxAge:1000*60*3})

            return res.send({
                msg:"Login Successfull"
            })

        }else{

            return res.status(400).send({
                msg:"Invalid Password"
            })

        }
        

        

    } catch (error) {
        
        return res.status(500).send({error:error.message, msg:"Something went wrong"})

    }

})

userRouter.get('/logout', async (req,res)=>{

    
    try {
        const {AccessToken, RefreshToken} = req.cookies;

        const token1 = new BlacklistedModel({
            Token:AccessToken
        })

        const token2 = new BlacklistedModel({
            Token:RefreshToken
        })

        await token1.save();

        await token2.save()

        return res.status(200).send({
            msg:"logout Successfull"
        })

    } catch (error) {

        return res.status(500).send({error:error.message, msg:"Something went wrong"})

    }
})


module.exports = {
    userRouter
}