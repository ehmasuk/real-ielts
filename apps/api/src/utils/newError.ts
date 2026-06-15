interface Params {
  message?: string;
  statusCode?: number;
}

interface CustomError extends Error {
  statusCode?: number;
}

const newError = ({
  message = "Something went wrong",
  statusCode = 400,
}: Params): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  return error;
};

export default newError;
