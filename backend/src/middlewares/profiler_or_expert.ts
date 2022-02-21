/**
 * Djordje Rakonjac
 * Datamap AG, June 11, 2021
 */
 require('dotenv').config();
 import { Request, Response, NextFunction } from "express";
 const jwt = require('jwt-simple');
  
 export const ProfilerOrExpert = (req : Request, res : Response, next : NextFunction) => {
   
   const tokenPayload = req.get('Authorization');
 
   try {
     const token = jwt.decode(tokenPayload, process.env.JWT_TOKEN_SECRET);
     const { role } = token;

     if(role === 'POSMO_TECHNICAL' || role === 'POSMO_DATAPROFILER') {
       return next();
     }

    return next({ message: 'Access Denied.'});
   } catch(err) {
     return next({ message: 'Wrong token.'});
   }
 
 
 };
  