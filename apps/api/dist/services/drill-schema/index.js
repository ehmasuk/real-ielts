import { DrillSchemaModel } from "../../models/drill-schema.model.js";
const drillSchemaServices = {
    get: async (drillId) => {
        return DrillSchemaModel.findOne({ drillId }).lean();
    },
    getAll: async () => {
        return DrillSchemaModel.find().lean();
    },
    upsert: async (drillId, schema) => {
        const existing = await DrillSchemaModel.findOne({ drillId });
        if (existing) {
            existing.set("schema", schema);
            existing.set("version", existing.get("version") + 1);
            await existing.save();
            return existing.toObject();
        }
        const doc = await DrillSchemaModel.create({ drillId, schema, version: 1 });
        return doc.toObject();
    },
};
export default drillSchemaServices;
//# sourceMappingURL=index.js.map