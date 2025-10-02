import { NextFunction, Request, Response } from "express";
import { ResponseBody } from "./response.js";

/**
 * Custom logging middleware that prints out the HTTP request method, path, and
 * body to the console.
 *
 * You should design your own logging middleware when building a production application.
 */
export function loggingMiddleware(req: Request, _: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.path} ${JSON.stringify(req.body)}`);
  next();
}

/**
 * Custom error middleware for Express.js that allows us to propagate the full error
 * message to the client.
 *
 * You should design your own error middleware when building a production application.
 */
export function errorMiddleware(error: Error, _: Request, res: Response): void {
  console.error(`Error: ${error.message}`);
  res.status(500).send({
    stytchResponse: null,
    error,
  } as ResponseBody<null>);
}
