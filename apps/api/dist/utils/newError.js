const newError = ({ message = "Something went wrong", statusCode = 400, }) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
export default newError;
//# sourceMappingURL=newError.js.map