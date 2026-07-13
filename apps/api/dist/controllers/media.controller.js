import mediaServices from "../services/media/index.js";
import catchAsync from "../utils/catchAsync.js";
export const getAllMedia = catchAsync(async (req, res) => {
    const assets = await mediaServices.getAll(req.user.id);
    res.status(200).json(assets);
});
export const createMedia = catchAsync(async (req, res) => {
    const { title, url, publicId, type, filename, bytes } = req.body;
    const asset = await mediaServices.create({
        title,
        url,
        publicId,
        type,
        filename,
        bytes,
        userId: req.user.id,
    });
    res.status(201).json(asset);
});
export const updateMedia = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ message: "Missing media id" });
        return;
    }
    const asset = await mediaServices.update(id, req.user.id, req.body);
    if (!asset) {
        res.status(404).json({ message: "Media not found" });
        return;
    }
    res.status(200).json(asset);
});
export const deleteMedia = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ message: "Missing media id" });
        return;
    }
    const asset = await mediaServices.remove(id, req.user.id);
    if (!asset) {
        res.status(404).json({ message: "Media not found" });
        return;
    }
    res.status(200).json({ message: "Media deleted" });
});
//# sourceMappingURL=media.controller.js.map