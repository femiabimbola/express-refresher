import {Request, Response, NextFunction, Router} from "express";

const router = Router();

router.get("/api/products", (req: any, res: Response) => {
  console.log(req.headers.cookie);
  res.status(200).send({id: 1, name: "Amala ", price: 300});
});

export default router;
