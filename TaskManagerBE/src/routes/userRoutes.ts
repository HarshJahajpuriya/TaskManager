import express from 'express';
import { getAllUsers } from '../controllers/userController';

const userRoutes = express.Router();

userRoutes.get('/', getAllUsers);

export default userRoutes;