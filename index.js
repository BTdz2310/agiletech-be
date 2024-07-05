import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import cookieParser from "cookie-parser";

import postRouter from './routers/postRouter.js'
import authRouter from './routers/authRouter.js'


const app = express();

const index = http.createServer(app);

app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: `${process.env.URL_FE}`,
    exposedHeaders: ["Set-Cookie"],
}));

app.use(cors());

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', `${process.env.URL_FE}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,set-cookie');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});  

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const port = process.env.PORT || 5002;

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connect DB Successful')
    }catch(error){
        console.log('Error Connect DB',error)
    }
}

connectDB();

app.use('/posts', postRouter);
app.use('/auth', authRouter);

index.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})

