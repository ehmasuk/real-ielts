import type { Response } from "express";

interface SuccessResponseParams {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: unknown;
  extra?: object;
}

const successResponse = ({
  res,
  statusCode = 200,
  message = "Success",
  data,
  extra = {},
}: SuccessResponseParams): Response => {
  const responseBody: { code: number; message: string; data?: unknown } = {
    code: statusCode,
    message,
    ...extra,
  };
  if (data) responseBody.data = data;

  return res.status(statusCode).json(responseBody);
};

export default successResponse;
