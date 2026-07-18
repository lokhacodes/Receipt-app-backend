import { Request, Response } from "express";
import { readReceipt } from "../services/ocr.service";
import { parseReceipt } from "../services/receiptParser";

export const scanReceipt = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const ocr = await readReceipt(req.file);

    const text =
      ocr?.ParsedResults?.[0]?.ParsedText ?? "";

    const receipt = parseReceipt(text);

    return res.json(receipt);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "OCR Failed",
    });
  }
};