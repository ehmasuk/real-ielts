import { type IDrillProgress } from "../../models/drill-progress.model.js";
export interface UpdateProgressPayload {
    levelNumber: number;
    stars: number;
    accuracy: number;
}
declare const drillProgressServices: {
    get: (userId: string, drillId: string) => Promise<IDrillProgress | null>;
    upsert: (userId: string, drillId: string, payload: UpdateProgressPayload) => Promise<IDrillProgress>;
    reset: (userId: string, drillId: string) => Promise<IDrillProgress | null>;
};
export default drillProgressServices;
//# sourceMappingURL=index.d.ts.map