import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../types/index.js";
import { default as newError, default as newErros } from "../utils/newError.js";

interface Params {
  model: any;
  paramName: string;
  ownerField: string;
}

const isOwned =
  ({ model, paramName, ownerField }: Params) =>
  async (req: CustomRequest, _res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) throw newErros({ message: "Unauthorized", statusCode: 401 });

      const itemId = req.params[paramName];
      if (!itemId) throw newErros({ message: "Resource not found", statusCode: 400 });

      // Placeholder for actual DB check
      // For now, we'll just allow it if there's no model logic
      if (model && typeof model.findById === "function") {
        const info = await model.findById(itemId);
        if (!info) throw newErros({ message: "Resource not found", statusCode: 404 });

        if (!(info[ownerField] == userId)) {
          throw newError({ message: "Forbidden", statusCode: 409 });
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default isOwned;
