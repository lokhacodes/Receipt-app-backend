import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  scanReceipt,
  parseReceipt,
} from "../services/receipt.service";

export async function uploadReceipt(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image required",
      });
    }

    // uploaded image path
    const imagePath = req.file.path;

    // OCR API
    const result = await scanReceipt(imagePath);

    if (
      !result.ParsedResults ||
      result.ParsedResults.length === 0
    ) {
      return res.status(400).json({
        message: "OCR failed",
      });
    }

    // Extract plain text
    const parsedText =
      result.ParsedResults[0].ParsedText;

    // Convert text to receipt data
    const receipt = parseReceipt(parsedText);

    return res.status(200).json({
      success: true,
      receipt,
      raw: result,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to scan receipt",
    });

  }
}