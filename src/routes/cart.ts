import {Request, Response, NextFunction, Router} from "express";

const router = Router();

router.post("/api/cart/", (req: any, res: Response) => {
  if (!req.session.user) {
    return res.status(200).send({msg: "Not unauthenticated"});
  }
  const {item} = req.body;
  const {cart} = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  res.status(200).send(item);
});

router.get("/api/cart/", (req: any, res: Response) => {
  if (!req.session.user) {
    return res.status(401).send({msg: "Not unauthenticated"});
  }
  return res.status(200).send(req.session.cart ?? []); // ?? means undefined use empty arry
});

export default router;
