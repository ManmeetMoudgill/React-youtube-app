import { Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  | Promise<Response<any, Record<string, any>> | undefined>
  | Promise<void>
  | Promise<void | Response<any, Record<string, any>>>;

const asyncMiddleware =
  (theFunc: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(theFunc(req, res, next)).catch(
      next
    ) as Promise<void>;
  };

export default asyncMiddleware;
