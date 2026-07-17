import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types/auth";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  const token = auth.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = decoded as JwtPayload;

      next();
    }
  );
};