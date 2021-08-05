import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import ErrorMiddleware from '@shared/middlewares/ErrorMiddleware';

import '@shared/infra/typeorm';
import '@shared/container';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(ErrorMiddleware);

app.listen(process.env.NODE_PORT, () => {
  console.log(`Server started on port ${process.env.NODE_PORT}!`);
});
