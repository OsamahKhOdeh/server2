import express from "express";
import { createNewUser, deleteUser, getAllUsers, updateUser} from "../controllers/userControllers.js";

const router = express.Router();

router.route('/')
.get(getAllUsers)
.post(createNewUser)
.delete(deleteUser);

router.patch('/:id', updateUser);

export default router;
