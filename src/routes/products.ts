import {Request, Response, NextFunction, Router} from "express";

const router = Router();

router.get("/api/products", (req: any, res: Response) => {
  // console.log(req.headers.cookie);
  // console.log(req.cookies);

  if (req.cookies.hello && req.cookies.hello === "world") {
    return res.status(200).send({id: 1, name: "Amala ", price: 300});
  }
  return res.status(403).send({msessage: "no permission"});
});

export default router;
