import { z } from "zod";
import { RequestHandler } from "express";

export const validateRequest =
  (schema: z.ZodSchema<any>): RequestHandler =>
  (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(422).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
