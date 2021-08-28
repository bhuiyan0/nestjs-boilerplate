// import { NestMiddleware, Injectable } from "@nestjs/common";
// import { Request,Response, NextFunction } from "express";

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware{
// 	use(req:Request,res:Response,next:NextFunction){
// 		console.log('Request...');
// 		next();
// 	}
// }

import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const current = new Date().toLocaleString();
  const method = req.method || 'GET';
  const url = req.url || 'http://localhost:5005';

  const msg = `>>>>>>>>>>>>>>>>>>>>>> TIME:: ${current}; METHOD:: ${method}; URL:: ${url}; <<<<<<<<<<<<<<<<`;
  // console.log(msg);

  next();
}
