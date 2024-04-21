dotenv.config()
import dotenv from 'dotenv'
import express from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { corsOptions } from './config/corsOptions.js'

import { verifyJWT } from './middleware/verifyJWT.js'
import { verifyUserExist } from './middleware/verifyUserExist.js'

import usersRoutes from './routes/usersRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import authRoutes from './routes/authRoutes.js'

import { GoogleGenerativeAI } from '@google/generative-ai'


process.env.TZ = "Europe/Rome";


// GEMINI

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
export const gemini = genAI.getGenerativeModel({ model: 'gemini-pro' })

const app = express();

const PORT = process.env.PORT || 3500;

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", verifyJWT, usersRoutes);
app.use('/chats', verifyJWT, verifyUserExist, chatRoutes)
app.use("/auth", authRoutes);
console.log(process.env.DATABASE_URI);
connect(process.env.DATABASE_URI)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Database connected: ✅\nServer running [${PORT}]: ✅ `)
    )
  )
  .catch((err) => console.error(err));
