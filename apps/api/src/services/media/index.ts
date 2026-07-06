import { MediaAsset, type IMediaAsset } from "../../models/media-asset.model.js";

const mediaServices = {
  getAll: (userId: string): Promise<IMediaAsset[]> => {
    return MediaAsset.find({ userId }).sort({ createdAt: -1 }).lean();
  },

  getById: (id: string, userId: string): Promise<IMediaAsset | null> => {
    return MediaAsset.findOne({ _id: id, userId }).lean();
  },

  create: (data: {
    title: string;
    url: string;
    publicId: string;
    type: IMediaAsset["type"];
    filename: string;
    bytes: number;
    userId: string;
  }): Promise<IMediaAsset> => {
    return MediaAsset.create(data);
  },

  update: (id: string, userId: string, data: { title?: string; used?: boolean }): Promise<IMediaAsset | null> => {
    return MediaAsset.findOneAndUpdate({ _id: id, userId }, data, { returnDocument: "after" }).lean();
  },

  remove: (id: string, userId: string): Promise<IMediaAsset | null> => {
    return MediaAsset.findOneAndDelete({ _id: id, userId }).lean();
  },
};

export default mediaServices;
