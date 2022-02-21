import { Request, Response, NextFunction } from "express"

export function Error (err : Error, req : Request, res : Response, next : NextFunction) {
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(401).send({ message: err.message });
}