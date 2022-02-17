/**
 * Djordje Rakonjac
 * Datamap AG, Mar 24, 2021
 */
require('dotenv').config();
import { Request, Response, NextFunction } from "express";
const jwt = require('jwt-simple');
 
export const Authentication = (req : Request, res : Response, next : NextFunction) => {
  
  const tokenPayload = req.get('Authorization');
 
  if (!tokenPayload) {
    return next({ message: 'Missing auth header!'});
  }

  try {
    const token = jwt.decode(tokenPayload, process.env.JWT_TOKEN_SECRET);
    const { exp } = token;

    let tokenTimeToExp = parseInt(exp, 10) - new Date().getTime();
    if (tokenTimeToExp < 0) {
      return next({ message: 'Expired token.'});
    } else {
      return next();
    }
  } catch(err) {
    return next({ message: 'Wrong token.'});
  }


};
 