import drillSchemaServices from "../services/drill-schema/index.js";
import catchAsync from "../utils/catchAsync.js";
import successResponse from "../utils/successResponse.js";
import newError from "../utils/newError.js";
const getSchema = catchAsync(async (req, res) => {
    const { drillId } = req.params;
    if (!drillId)
        throw newError({ message: "drillId is required", statusCode: 400 });
    const doc = await drillSchemaServices.get(drillId);
    if (!doc)
        throw newError({ message: "Schema not found", statusCode: 404 });
    successResponse({ res, data: { schema: doc.schema, version: doc.version } });
});
const getAllSchemas = catchAsync(async (req, res) => {
    const docs = await drillSchemaServices.getAll();
    successResponse({ res, data: docs.map((d) => ({ drillId: d.drillId, version: d.version })) });
});
const getAllSchemasPublic = catchAsync(async (req, res) => {
    const docs = await drillSchemaServices.getAll();
    successResponse({ res, data: docs.map((d) => ({ drillId: d.drillId, schema: d.schema, version: d.version })) });
});
const getSchemaAdmin = catchAsync(async (req, res) => {
    const { drillId } = req.params;
    if (!drillId)
        throw newError({ message: "drillId is required", statusCode: 400 });
    const doc = await drillSchemaServices.get(drillId);
    if (!doc)
        throw newError({ message: "Schema not found", statusCode: 404 });
    successResponse({ res, data: { drillId: doc.drillId, schema: doc.schema, version: doc.version, updatedAt: doc.updatedAt } });
});
const updateSchema = catchAsync(async (req, res) => {
    const { drillId } = req.params;
    if (!drillId)
        throw newError({ message: "drillId is required", statusCode: 400 });
    const { schema } = req.body;
    if (!schema || typeof schema !== "object")
        throw newError({ message: "schema object is required", statusCode: 400 });
    const doc = await drillSchemaServices.upsert(drillId, schema);
    successResponse({ res, data: { drillId: doc.drillId, version: doc.version, updatedAt: doc.updatedAt }, message: "Schema updated" });
});
export default { getSchema, getAllSchemas, getAllSchemasPublic, getSchemaAdmin, updateSchema };
//# sourceMappingURL=drill-schema.controller.js.map