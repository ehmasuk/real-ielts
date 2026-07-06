interface Params {
    message?: string;
    statusCode?: number;
}
interface CustomError extends Error {
    statusCode?: number;
}
declare const newError: ({ message, statusCode, }: Params) => CustomError;
export default newError;
//# sourceMappingURL=newError.d.ts.map