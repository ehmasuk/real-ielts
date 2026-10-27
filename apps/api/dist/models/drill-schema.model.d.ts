import mongoose from "mongoose";
export interface IDrillSchema {
    _id: mongoose.Types.ObjectId;
    drillId: string;
    schema: Record<string, unknown>;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DrillSchemaModel: mongoose.Model<{
    schema: any;
    version: number;
    drillId: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    schema: any;
    version: number;
    drillId: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    schema: any;
    version: number;
    drillId: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    schema: any;
    version: number;
    drillId: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    schema: any;
    version: number;
    drillId: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    schema: any;
    version: number;
    drillId: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    schema: any;
    version: number;
    drillId: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    schema: any;
    version: number;
    drillId: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=drill-schema.model.d.ts.map