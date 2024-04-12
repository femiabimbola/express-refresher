import {Request, Response, NextFunction, Router} from "express";

const router = Router();

router.get("/api/products", (req: any, res: Response) => {
  console.log(req.session);
  console.log(req.session.id);
  if (req.cookies.hello && req.cookies.hello === "world") {
    return res.status(200).send({id: 1, name: "Amala ", price: 300});
  }
  return res.status(403).send({msessage: "no permission"});
});

export default router;
