import express from "express";
import { createNewUser, deleteUser, getAllUsers, updateUser} from "../controllers/userControllers.js";

const router = express.Router();

router.route('/')
.get(getAllUsers)
.post(createNewUser)
.patch(updateUser)
.delete(deleteUser);

export default router;
