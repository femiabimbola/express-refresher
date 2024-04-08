import {Router} from "express";

import userRouter from "./users";
import productRouter from "./products";

const router = Router();

router.use(userRouter);
router.use(productRouter);

export default router;
