import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

// roles = ["admin", "customer"]
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ 
          success: false, 
          message: "Authentication token is missing!",
          errors: 'UNAUTHORIZED' 
        });
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ 
          success: false, 
          message: "Token format is invalid. Expected 'Bearer <token>'",
          errors: 'UNAUTHORIZED' 
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;

      req.user = decoded;

      //["admin"]
      if (roles.length > 0 && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: "Access forbidden. Insufficient permissions.",
          errors: 'FORBIDDEN'
        });
      }

      next();

    } catch (err: any) {

      let statusCode = 401;
      let errorMessage = "Unauthorized";

      if (err instanceof jwt.JsonWebTokenError) {
        errorMessage = err.message;
      } else {
        statusCode = 500;
        errorMessage = "Internal Server Error";
      }

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        errors: errorMessage
      });
    }
  };
};

export default auth;