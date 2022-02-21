/**
 * Djordje Rakonjac
 * Datamap AG, Mar 28, 2021
 */
 require('dotenv').config();
 import { Request, Response, NextFunction } from "express";
 const jwt = require('jwt-simple');
  
 export const Private = (req : Request, res : Response, next : NextFunction) => {
   
   const tokenPayload = req.get('Authorization');
 
   try {
     const token = jwt.decode(tokenPayload, process.env.JWT_TOKEN_SECRET);
     const { sub } = token;

    if(sub === req.query.user_id) {
      return next();
    }
 
    if(sub !== (req.body.properties && req.body.properties.user_id)) {
      return next({ message: 'Access Denied.'})
    }

    return next();
   } catch(err) {
     return next({ message: 'Wrong token.'});
   }
 
 
 };
  