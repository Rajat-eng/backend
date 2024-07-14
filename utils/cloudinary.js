import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME.toString(),
  api_key: process.env.CLOUDINARY_API_KEY.toString(),
  api_secret: process.env.CLOUDINARY_API_SECRET.toString(),
});

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, uploadResult) => {
        if (error) {
          reject(error);
        } else {
          resolve(uploadResult);
        }
      })
      .end(buffer);
  });
};

export { uploadToCloudinary };
