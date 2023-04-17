
const {Router} = require('express');


require('dotenv').config();

const {verifyRole} = require('../middlewares/verifyRole')

const { BlogModel } = require('../models/blog.model');


const blogRouter = Router();


blogRouter.post('/create', async (req,res)=>{

    const {UserID, Role} = req.payload;

    const {Title, Description} = req.body;

    try {

        const newBlog = new BlogModel({AuthorID:UserID, Title, Description});

        await newBlog.save()


        return res.status(200).send({
            msg:"Blog has been created successfully",
            blog:newBlog
        })


    } catch (error) {

        return res.status(500).send({error:error.message, msg:"Something went wrong"})

    }

});



blogRouter.get('/get', async (req,res)=>{

    try {

        const blogs = await BlogModel.find();

        return res.status(200).send({"Blogs":blogs})

    } catch (error) {

        return res.status(500).send({error:error.message, msg:"Something went wrong"})

    }

})





blogRouter.patch('/update/:blogID', async (req,res)=>{

    const {blogID} = req.params

    const {UserID, Role} = req.payload;

    try {

        const blog = await BlogModel.findById({_id:blogID});

        if(blog){

            if(blog.AuthorID == UserID){

                const updatedblog = await BlogModel.findByIdAndUpdate({_id:blogID}, req.body);

                const nowblog = await BlogModel.findById({_id:blogID});

                return res.status(200).send({
                    msg:"Your Blog has been updated successfully",
                    blog:nowblog
                })

            }else{

                return res.status(400).send({
                    msg:"You can not able to update of another user"
                })

            }
        }else{

            return res.status(404).send({msg:"blog not found"})

        }


    } catch (error) {

        return res.status(500).send({error:error.message, msg:"Something went wrong"})

    }


})






blogRouter.delete('/delete/:blogID', verifyRole(["Moderator"]), async (req,res)=>{

    const {blogID} = req.params

    try {

        const updatedblog = await BlogModel.findByIdAndDelete({_id:blogID});

        return res.status(200).send({
            msg:"Your Blog has been deleted successfully"
        })

    } catch (error) {

        return res.status(500).send({error:error.message, msg:"Something went wrong"})
        
    }

})


module.exports = {
    blogRouter
}