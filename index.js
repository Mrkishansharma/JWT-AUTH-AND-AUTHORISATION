
const express = require('express');

const { connection } = require('./config/db');

const cookieParser = require('cookie-parser');

const { userRouter } = require('./routes/user.routes');

const { auth } = require('./middlewares/auth');

const { blogRouter } = require('./routes/blog.routes');

require('dotenv').config();



const app = express();

app.get('/', (req,res)=>{
    res.status(200).send("HOME PAGE")
})

app.use(cookieParser());

app.use(express.json());




app.use('/user', userRouter);



app.use(auth);

app.use('/blog', blogRouter)




app.all('*', (req,res)=>{
    res.status(404).send({
        error:"404 Page Not Found"
    })
})


app.listen(process.env.port, async ()=>{

    try {
        
        await connection

        console.log('DB Connected');

    } catch (error) {
        
        console.log(error);

    }

    console.log('server is running');

})