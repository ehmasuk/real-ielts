const successResponse = ({ res, statusCode = 200, message = "Success", data, extra = {}, }) => {
    const responseBody = {
        code: statusCode,
        message,
        ...extra,
    };
    if (data)
        responseBody.data = data;
    return res.status(statusCode).json(responseBody);
};
export default successResponse;
//# sourceMappingURL=successResponse.js.map