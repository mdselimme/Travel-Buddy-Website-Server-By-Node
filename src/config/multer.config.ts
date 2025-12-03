import multer from 'multer';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUploadFile } from './cloudinary.config';
import { Request } from 'express';



interface CloudinaryStorageParams {
    folder: string;
    public_id: (req: Request, file: Express.Multer.File) => string;
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUploadFile,
    params: {
        folder: "images",
        public_id: (req: Request, file: Express.Multer.File) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/\./g, "-")
                .replace(/[^a-z0-9\-.]/g, "-");
            const extension = file.originalname.split(".").pop();
            const uniqueFileName = Math.random().toString(36).substring(2) + "_" + Date.now() + "_" + fileName + "." + extension;
            return uniqueFileName;
        }
    } as CloudinaryStorageParams,
});

export const multerUpload = multer({ storage });