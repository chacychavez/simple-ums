import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"
import userRoutes from './routes/user.routes'
const app: Application = express();


app.use(bodyParser.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Simple User Management System!')
})
app.use('/users', userRoutes)

export default app;