import express from "express";
import { createNewUser, deleteUser, getAllUsers, updateUser} from "../controllers/userControllers.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.use(verifyJWT)

router.route('/')
.get(getAllUsers)
.post(createNewUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;
