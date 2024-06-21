import express from 'express';
import http from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from 'cors'
import mongoose from 'mongoose'
require('dotenv').config();

import router from './router';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log("Server running")
})


const MONGO_URL = process.env.DATABASE_URL

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err: any) => {
    console.error('MongoDB connection error:', err);
  });

mongoose.connection.on("error", (error: Error) => console.log(error))

app.use('/', router())