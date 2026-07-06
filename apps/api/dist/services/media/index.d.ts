import { type IMediaAsset } from "../../models/media-asset.model.js";
declare const mediaServices: {
    getAll: (userId: string) => Promise<IMediaAsset[]>;
    getById: (id: string, userId: string) => Promise<IMediaAsset | null>;
    create: (data: {
        title: string;
        url: string;
        publicId: string;
        type: IMediaAsset["type"];
        filename: string;
        bytes: number;
        userId: string;
    }) => Promise<IMediaAsset>;
    update: (id: string, userId: string, data: {
        title?: string;
        used?: boolean;
    }) => Promise<IMediaAsset | null>;
    remove: (id: string, userId: string) => Promise<IMediaAsset | null>;
};
export default mediaServices;
//# sourceMappingURL=index.d.ts.map