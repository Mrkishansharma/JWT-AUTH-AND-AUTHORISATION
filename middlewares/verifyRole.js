
const { BlogModel } = require("../models/blog.model");


const verifyRole = (permiteRole) =>{

    return async (req,res,next)=>{

        const {blogID} = req.params;

        const {UserID, Role} = req.payload;

        try {

            const blog = await BlogModel.findById({_id:blogID});

            if(blog){
                
                if(blog.AuthorID == UserID || permiteRole.includes(Role)){

                    next()

                }else{

                    return res.status(400).send({
                        msg:"You can not able to delete blog. (UnAuthorized Access). "
                    })

                }

            }else{

                return res.status(404).send({msg:"blog not found"})

            }

        } catch (error) {

            return res.status(500).send({error:error.message, msg:"Something went wrong"})

        }
    }
}

module.exports = {
    verifyRole
}