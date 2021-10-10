import express, {Request, Response} from 'express';
import cors from 'cors'
import productRouter from './routes/product.router'
import catRouter from './routes/cat.router'
import userRouter from './routes/user.route'
const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('Express + TypeScript Server'));
app.use('/api/products', productRouter)
app.use('/api/categories', catRouter)
app.use('/api/users', userRouter)
app.use('*', (req: Request, res: Response) =>  res.send('ERROR 404 NOTFOUND'))

export default app