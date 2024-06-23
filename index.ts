import express from 'express';
import http from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path';
require('dotenv').config();

import router from './router';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: "https://jlpt-news-study.vercel.app",
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log("Server running")
})


const MONGO_URL = process.env.DATABASE_URL

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err: any) => {
    console.error('MongoDB connection error:', err);
  });

mongoose.connection.on("error", (error: Error) => console.log(error))

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use('/', router())

// Catch-all handler to serve the frontend's index.html
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

