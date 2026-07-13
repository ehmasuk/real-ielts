/**
 * Wraps async Express controllers to automatically catch errors and pass them to the global error handler.
 * This removes the need for repetitive try/catch blocks in every controller.
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
export default catchAsync;
//# sourceMappingURL=catchAsync.js.map