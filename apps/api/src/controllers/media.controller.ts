import type { Response, NextFunction } from "express";
import type { CustomRequest } from "../types/index.js";
import mediaServices from "../services/media/index.js";

export const getAllMedia = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const assets = await mediaServices.getAll(req.user!.id);
    res.status(200).json(assets);
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { title, url, publicId, type, filename, bytes } = req.body;
    const asset = await mediaServices.create({
      title,
      url,
      publicId,
      type,
      filename,
      bytes,
      userId: req.user!.id,
    });
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
};

export const updateMedia = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "Missing media id" });
      return;
    }
    const asset = await mediaServices.update(id, req.user!.id, req.body);
    if (!asset) {
      res.status(404).json({ message: "Media not found" });
      return;
    }
    res.status(200).json(asset);
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "Missing media id" });
      return;
    }
    const asset = await mediaServices.remove(id, req.user!.id);
    if (!asset) {
      res.status(404).json({ message: "Media not found" });
      return;
    }
    res.status(200).json({ message: "Media deleted" });
  } catch (error) {
    next(error);
  }
};
