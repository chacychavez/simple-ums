import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"
import cors from 'cors';

import userRoutes from './routes/user.routes'

const app: Application = express();

app.use(cors())

app.use(bodyParser.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Simple User Management System!')
})
app.use('/users', userRoutes)

export default app;