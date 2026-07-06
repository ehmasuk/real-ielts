import { MediaAsset } from "../../models/media-asset.model.js";
const mediaServices = {
    getAll: (userId) => {
        return MediaAsset.find({ userId }).sort({ createdAt: -1 }).lean();
    },
    getById: (id, userId) => {
        return MediaAsset.findOne({ _id: id, userId }).lean();
    },
    create: (data) => {
        return MediaAsset.create(data);
    },
    update: (id, userId, data) => {
        return MediaAsset.findOneAndUpdate({ _id: id, userId }, data, { returnDocument: "after" }).lean();
    },
    remove: (id, userId) => {
        return MediaAsset.findOneAndDelete({ _id: id, userId }).lean();
    },
};
export default mediaServices;
//# sourceMappingURL=index.js.map