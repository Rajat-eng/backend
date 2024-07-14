import express from "express";
import http from "http";
import multer from "multer";
import dotenv from "dotenv";
import { uploadToCloudinary } from "./utils/cloudinary.js";
import cors from "cors";
import Tesseract from "tesseract.js";
const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
};

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000","ocr-frontend-ivory.vercel.app"],
    allowHeaders: ["GET", "POST"],
  })
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use("/upload", upload.single("file"), async (req, res) => {
  try {
    const { secure_url } = await uploadToCloudinary(req.file.buffer);
    const {
      data: { text },
    } = await Tesseract.recognize(secure_url, "eng", {
      // logger: (m) => console.log(m),
    });
    // console.log("data", text);
    return res.status(200).json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
});

const server = http.createServer(app);

server.listen(8000, () => {
  console.log("server started");
});
