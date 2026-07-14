import { type IDrillSchema } from "../../models/drill-schema.model.js";
declare const drillSchemaServices: {
    get: (drillId: string) => Promise<IDrillSchema | null>;
    getAll: () => Promise<IDrillSchema[]>;
    upsert: (drillId: string, schema: Record<string, unknown>) => Promise<IDrillSchema>;
};
export default drillSchemaServices;
//# sourceMappingURL=index.d.ts.map