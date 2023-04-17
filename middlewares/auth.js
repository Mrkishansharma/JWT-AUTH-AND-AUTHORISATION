
const jwt = require('jsonwebtoken');

const { BlacklistedModel } = require('../models/blacklisted.model');

const { UserModel } = require('../models/user.model');

require('dotenv').config();



const auth = async  (req,res,next) =>{

    const {AccessToken, RefreshToken} = req.cookies;

    console.log(AccessToken, RefreshToken);

    try {
        
        
        const isblacklisted = await BlacklistedModel.findOne({Token:AccessToken});

        
        if(isblacklisted){

            return res.status(400).send({
                msg : "Login First. Access token blacklisted"
            })

        }

        const decoded = jwt.verify(AccessToken, process.env.AccessToken);

        if(decoded){

            req.payload = decoded;

            next();

        }else{

            return res.send('Invalid Access Token');

        }

    } catch (error) {
        // if(error.message == 'jwt expired'){

            try {

                const isblacklisted = await BlacklistedModel.findOne({Token:RefreshToken});

                if(isblacklisted){
                    return res.status(400).send({
                        msg : "Login First. Refresh token blacklisted"
                    })
                }

                const decoded = jwt.verify(RefreshToken, process.env.RefreshToken);

                if(decoded){

                    const accesstoken = jwt.sign({UserID:decoded._id, Role:decoded.Role}, process.env.AccessToken, {expiresIn:"1m"});

                    res.cookie("AccessToken", accesstoken, {maxAge:1000*60*3});

                    console.log('generate kiya', req.cookies);

                    req.payload = decoded;

                    next();

                }else{

                    return res.send('Invalid Refresh Token')

                }

            } catch (e) {

                return resstatus(500).send({error:e.message, msg:"Login Required!"})

            }


        // }else{

        //     return res.send({error:error.message, msg:"11"})

        // }



    }
}

module.exports = {
    auth
}