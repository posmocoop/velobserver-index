/**
** add some security headers to response
** Djordje Rakonjac, March 24, 2021
** Datamap AG
**/
import { Response, NextFunction, Request } from "express";

export const SecurityHeaders = (req : Request, res : Response, next : NextFunction) => {
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('X-Content-Type-Options', 'nosniff');
  next();
}
