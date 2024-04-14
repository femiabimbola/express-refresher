import {Router} from "express";

import userRouter from "./users";
import productRouter from "./products";
import authRouter from "./auth";

const router = Router();

router.use(userRouter);
router.use(productRouter);
router.use(authRouter);

export default router;
