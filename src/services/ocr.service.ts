import axios from "axios";
import FormData from "form-data";
import { Express } from "express";

export const readReceipt = async (file: Express.Multer.File) => {
  const form = new FormData();

  form.append("apikey", process.env.OCR_SPACE_API_KEY!);
  form.append("language", "eng");
  form.append("isTable", "true");

  form.append("file", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  const response = await axios.post(
    "https://api.ocr.space/parse/image",
    form,
    {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    }
  );

  return response.data;
};