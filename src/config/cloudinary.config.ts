/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import stream from "stream";
import { envVars } from "./envVariable.config";
import ApiError from "../app/utils/ApiError";


cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
    api_key: envVars.CLOUDINARY.API_KEY,
    api_secret: envVars.CLOUDINARY.API_SECRET
});

export const uploadFileToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> => {
    try {

        return new Promise((resolve, reject) => {
            const public_id = `pdf/${fileName}-${Date.now()}`;
            const bufferStream = new stream.PassThrough();
            bufferStream.end(buffer);

            cloudinary.uploader.upload_stream(
                {
                    folder: "pdf",
                    public_id,
                    resource_type: "auto",
                    use_filename: true,
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(bufferStream);


        })


    } catch (error: any) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Error file upload to cloudinary: ${error.message}.`)
    }
};

export const cloudinaryUploadFile = cloudinary;