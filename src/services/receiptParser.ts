export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  merchant: string;
  address: string;
  phone: string;
  date: string;
  time: string;
  subtotal: number;
  tax: number;
  total: number;
  items: ReceiptItem[];
  rawText: string;
}

const cleanLine = (line: string) => {
  return line
    .replace(/[|]/g, "1")
    .replace(/[Oo]/g, "0")
    .replace(/[Ss]\$/g, "$")
    .replace(/S(?=\d)/g, "$")
    .replace(/\s+/g, " ")
    .trim();
};

const getNumber = (line: string): number => {

  const fixed = line
    .replace(/[|]/g, "1")
    .replace(/[Oo]/g, "0")
    .replace(/S(?=\d)/g, "$");

  const match = fixed.match(/(\d+\.\d{2})/);

  return match ? Number(match[1]) : 0;

};

export const parseReceipt = (
  text: string
): ReceiptData => {

  const lines = text
    .split("\n")
    .map(cleanLine)
    .filter(Boolean);

  let merchant = "";
  let address = "";
  let phone = "";
  let date = "";
  let time = "";

  let subtotal = 0;
  let tax = 0;
  let total = 0;

  const items: ReceiptItem[] = [];

  merchant = lines[0] ?? "";

  for (const line of lines) {

    const upper = line.toUpperCase();

    //----------------------------------------
    // Address
    //----------------------------------------

    if (
      !address &&
      (
        upper.includes("AVE") ||
        upper.includes("ROAD") ||
        upper.includes("ST") ||
        upper.includes("BLVD") ||
        upper.includes("CA")
      )
    ) {

      address = line;

    }

    //----------------------------------------
    // Phone
    //----------------------------------------

    if (!phone) {

      const phoneMatch = line.match(
        /(\+?\d[\d\s\-]{6,})/
      );

      if (phoneMatch)
        phone = phoneMatch[1];

    }

    //----------------------------------------
    // Date
    //----------------------------------------

    if (!date) {

      const match = line.match(
        /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/
      );

      if (match)
        date = match[0];

    }

    //----------------------------------------
    // Time
    //----------------------------------------

    if (!time) {

      const match = line.match(
        /\d{1,2}:\d{2}\s?(AM|PM)/i
      );

      if (match)
        time = match[0];

    }

    //----------------------------------------
    // Totals
    //----------------------------------------

    if (upper.includes("SUBTOTAL")) {

      subtotal = getNumber(line);

      continue;

    }

    if (upper.startsWith("TAX")) {

      tax = getNumber(line);

      continue;

    }

    if (
      upper.includes("BALANCE DUE") ||
      upper.startsWith("TOTAL")
    ) {

      total = getNumber(line);

      continue;

    }

    //----------------------------------------
    // Receipt Item
    //----------------------------------------

    const itemMatch = line.match(
      /^(.+?)\s+\$?(\d+\.\d{2})$/
    );

    if (!itemMatch)
      continue;

    const name = itemMatch[1].trim();

    if (
      name.includes("TOTAL") ||
      name.includes("TAX") ||
      name.includes("SUBTOTAL") ||
      name.includes("BALANCE")
    )
      continue;

    items.push({

      name,

      quantity: 1,

      price: Number(itemMatch[2]),

    });

  }

  return {

    merchant,

    address,

    phone,

    date,

    time,

    subtotal,

    tax,

    total,

    items,

    rawText: text,

  };

};