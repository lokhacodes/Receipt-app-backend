import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export async function scanReceipt(imagePath: string) {
  const form = new FormData();

  form.append("file", fs.createReadStream(imagePath));
  form.append("apikey", process.env.OCR_SPACE_API_KEY!);
  form.append("language", "eng");
  form.append("isTable", "true");

  const response = await axios.post(
    "https://api.ocr.space/parse/image",
    form,
    {
      headers: form.getHeaders(),
    }
  );

  return response.data;
}

export function parseReceipt(text: string) {
  const merchant = text.split("\n")[0]?.trim() ?? "";

  const amountMatch = text.match(/\d+\.\d{2}/);

  const dateMatch = text.match(
    /\d{2}[\/-]\d{2}[\/-]\d{4}/
  );

  return {
    merchant,
    amount: amountMatch ? Number(amountMatch[0]) : null,
    date: dateMatch ? dateMatch[0] : null,
    rawText: text,
  };
}