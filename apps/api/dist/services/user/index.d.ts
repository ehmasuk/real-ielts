declare const userServices: {
    list: (params: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
    }) => Promise<{
        users: {
            testsAttempted: any;
            googleId: string;
            email: string;
            name: string;
            picture: string;
            role: "student" | "admin";
            status: "active" | "disabled" | "banned";
            lastLoginAt: Date;
            createdAt: Date;
            updatedAt: Date;
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            isNew: boolean;
            schema: import("mongoose").Schema;
            __v: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    update: (userId: string, payload: {
        role?: string | undefined;
        status?: string | undefined;
    }) => Promise<import("mongoose").Document<unknown, {}, import("../../models/user.model.js").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model.js").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
};
export default userServices;
//# sourceMappingURL=index.d.ts.map