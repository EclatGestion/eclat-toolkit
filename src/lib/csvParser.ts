import Papa from "papaparse";

export interface ParsedTransaction {
  date: string;      // Format ISO: YYYY-MM-DD
  label: string;     // Libellé nettoyé
  amount: number;    // Montant normalisé (négatif = dépense)
}

export interface CSVParseConfig {
  dateColumn: number;
  labelColumn: number;
  labelColumns?: number[];  // Multiple columns to combine for label
  amountColumn: number;
  hasHeader: boolean;
  invertSign: boolean;
  dateFormat: "DD/MM/YYYY" | "YYYY-MM-DD" | "MM/DD/YYYY" | "auto";
}

export interface CSVPreviewData {
  headers: string[];
  rows: string[][];
  separator: string;
}

/**
 * Parse CSV file and return preview data (first 10 rows)
 */
export function parseCSVPreview(file: File): Promise<CSVPreviewData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      preview: 11, // 1 header + 10 rows
      complete: (results) => {
        const rows = results.data as string[][];
        if (rows.length === 0) {
          reject(new Error("Fichier CSV vide"));
          return;
        }
        
        // Detect separator
        const separator = (results.meta.delimiter as string) || ";";
        
        // First row as headers, rest as data rows
        const headers = rows[0] || [];
        const dataRows = rows.slice(1).filter(row => row.some(cell => cell?.trim()));
        
        resolve({
          headers,
          rows: dataRows,
          separator,
        });
      },
      error: (error) => {
        reject(new Error(`Erreur de parsing CSV: ${error.message}`));
      },
    });
  });
}

/**
 * Parse full CSV file with given configuration
 */
export function parseFullCSV(file: File, config: CSVParseConfig): Promise<ParsedTransaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const rows = results.data as string[][];
        const transactions: ParsedTransaction[] = [];
        
        // Skip header if configured
        const startIndex = config.hasHeader ? 1 : 0;
        
        for (let i = startIndex; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0 || !row.some(cell => cell?.trim())) continue;
          
          const dateValue = row[config.dateColumn];
          const amountValue = row[config.amountColumn];
          
          // Build label from multiple columns if configured, otherwise use single column
          let labelValue: string;
          if (config.labelColumns && config.labelColumns.length > 0) {
            labelValue = config.labelColumns
              .map(col => row[col]?.trim() || "")
              .filter(v => v.length > 0)
              .join(" - ");
          } else {
            labelValue = row[config.labelColumn] || "";
          }
          
          if (!dateValue || !amountValue) continue;
          
          const date = parseDate(dateValue, config.dateFormat);
          const label = cleanLabel(labelValue);
          let amount = parseAmount(amountValue);
          
          if (config.invertSign) {
            amount = -amount;
          }
          
          // Only keep expenses (negative amounts)
          if (amount < 0) {
            transactions.push({ date, label, amount });
          }
        }
        
        resolve(transactions);
      },
      error: (error) => {
        reject(new Error(`Erreur de parsing CSV: ${error.message}`));
      },
    });
  });
}

/**
 * Parse and normalize amount string to number
 */
export function parseAmount(value: string): number {
  if (!value) return 0;
  
  let cleaned = value.toString().trim();
  
  // Handle parentheses notation for negative: (100,00) = -100
  const hasParentheses = cleaned.startsWith("(") && cleaned.endsWith(")");
  if (hasParentheses) {
    cleaned = cleaned.slice(1, -1);
  }
  
  // Remove currency symbols and spaces
  cleaned = cleaned.replace(/[€$£EUR\s]/gi, "");
  
  // Handle French number format: 1 234,56 or 1.234,56
  // First, remove thousands separators (spaces or dots before comma)
  if (cleaned.includes(",")) {
    // French format: remove spaces/dots used as thousands separator
    cleaned = cleaned.replace(/[\s.]/g, "");
    // Then replace comma with dot for decimal
    cleaned = cleaned.replace(",", ".");
  } else {
    // English format: remove commas used as thousands separator
    cleaned = cleaned.replace(/,/g, "");
  }
  
  const num = parseFloat(cleaned);
  
  if (isNaN(num)) return 0;
  
  return hasParentheses ? -num : num;
}

/**
 * Parse and normalize date string to ISO format YYYY-MM-DD
 */
export function parseDate(value: string, format: CSVParseConfig["dateFormat"]): string {
  if (!value) return "";
  
  const cleaned = value.toString().trim();
  
  // Try to detect and parse the date
  let day: string, month: string, year: string;
  
  // Split by common separators
  const parts = cleaned.split(/[\/\-\.]/);
  
  if (parts.length !== 3) {
    // Try to parse as text date (e.g., "01-déc-2024")
    const textMatch = cleaned.match(/(\d{1,2})[\-\s]?([a-zéû]+)[\-\s]?(\d{2,4})/i);
    if (textMatch) {
      day = textMatch[1].padStart(2, "0");
      month = monthTextToNumber(textMatch[2]);
      year = textMatch[3].length === 2 ? "20" + textMatch[3] : textMatch[3];
      return `${year}-${month}-${day}`;
    }
    return cleaned;
  }
  
  if (format === "auto") {
    // Auto-detect format
    const first = parseInt(parts[0], 10);
    const second = parseInt(parts[1], 10);
    const third = parseInt(parts[2], 10);
    
    // If first part > 12, it's likely DD/MM/YYYY
    // If third part has 4 digits, it's the year
    // If first part has 4 digits, it's YYYY-MM-DD
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      year = parts[0];
      month = parts[1].padStart(2, "0");
      day = parts[2].padStart(2, "0");
    } else if (parts[2].length === 4 || third > 31) {
      // DD/MM/YYYY or MM/DD/YYYY
      if (first > 12) {
        // DD/MM/YYYY (day cannot be > 12 in month position)
        day = parts[0].padStart(2, "0");
        month = parts[1].padStart(2, "0");
        year = parts[2].length === 2 ? "20" + parts[2] : parts[2];
      } else if (second > 12) {
        // MM/DD/YYYY (month cannot be > 12)
        month = parts[0].padStart(2, "0");
        day = parts[1].padStart(2, "0");
        year = parts[2].length === 2 ? "20" + parts[2] : parts[2];
      } else {
        // Ambiguous, default to DD/MM/YYYY (European)
        day = parts[0].padStart(2, "0");
        month = parts[1].padStart(2, "0");
        year = parts[2].length === 2 ? "20" + parts[2] : parts[2];
      }
    } else {
      // Short year format, assume DD/MM/YY
      day = parts[0].padStart(2, "0");
      month = parts[1].padStart(2, "0");
      year = "20" + parts[2];
    }
  } else if (format === "DD/MM/YYYY") {
    day = parts[0].padStart(2, "0");
    month = parts[1].padStart(2, "0");
    year = parts[2].length === 2 ? "20" + parts[2] : parts[2];
  } else if (format === "YYYY-MM-DD") {
    year = parts[0];
    month = parts[1].padStart(2, "0");
    day = parts[2].padStart(2, "0");
  } else if (format === "MM/DD/YYYY") {
    month = parts[0].padStart(2, "0");
    day = parts[1].padStart(2, "0");
    year = parts[2].length === 2 ? "20" + parts[2] : parts[2];
  } else {
    return cleaned;
  }
  
  return `${year}-${month}-${day}`;
}

/**
 * Convert month text to number
 */
function monthTextToNumber(text: string): string {
  const months: Record<string, string> = {
    jan: "01", janv: "01", janvier: "01",
    fév: "02", fev: "02", février: "02", fevrier: "02",
    mar: "03", mars: "03",
    avr: "04", avril: "04",
    mai: "05",
    juin: "06", jun: "06",
    juil: "07", juillet: "07", jul: "07",
    aoû: "08", aout: "08", août: "08",
    sep: "09", sept: "09", septembre: "09",
    oct: "10", octobre: "10",
    nov: "11", novembre: "11",
    déc: "12", dec: "12", décembre: "12", decembre: "12",
  };
  
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return months[lower] || "01";
}

/**
 * Clean and normalize transaction label
 */
export function cleanLabel(value: string): string {
  if (!value) return "";
  
  let cleaned = value.toString().trim();
  
  // Remove card numbers (CB *1234, CARTE **** 5678)
  cleaned = cleaned.replace(/\*+\s*\d+/g, "");
  cleaned = cleaned.replace(/CB\s*\*+/gi, "");
  cleaned = cleaned.replace(/CARTE\s*/gi, "");
  
  // Remove reference numbers at the end
  cleaned = cleaned.replace(/\s+REF\s*:\s*\w+$/gi, "");
  cleaned = cleaned.replace(/\s+N°\s*\w+$/gi, "");
  
  // Remove multiple spaces
  cleaned = cleaned.replace(/\s+/g, " ");
  
  // Trim and capitalize first letter
  cleaned = cleaned.trim();
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  return cleaned;
}

/**
 * Auto-detect column mappings based on headers
 */
export function autoDetectColumns(headers: string[], rows?: string[][]): Partial<CSVParseConfig> {
  const config: Partial<CSVParseConfig> = {};
  
  const lowerHeaders = headers.map(h => h?.toLowerCase().trim() || "");
  
  console.log("=== AUTO-DETECT COLUMNS ===");
  console.log("Headers:", headers);
  console.log("Lower headers:", lowerHeaders);
  
  // Detect date column by header
  const datePatterns = ["date", "date opération", "date operation", "date valeur", "date comptable"];
  for (let i = 0; i < lowerHeaders.length; i++) {
    if (datePatterns.some(p => lowerHeaders[i].includes(p))) {
      config.dateColumn = i;
      console.log(`Date column detected by header at index ${i}: "${headers[i]}"`);
      break;
    }
  }
  
  // Detect label column by header
  const labelPatterns = ["libellé", "libelle", "label", "description", "intitulé", "intitule", "opération", "operation", "motif", "libellé 1", "libellé 2"];
  for (let i = 0; i < lowerHeaders.length; i++) {
    if (labelPatterns.some(p => lowerHeaders[i].includes(p))) {
      config.labelColumn = i;
      console.log(`Label column detected by header at index ${i}: "${headers[i]}"`);
      break;
    }
  }
  
  // Detect amount column (prefer débit/dépense over crédit)
  const amountPatterns = ["débit", "debit", "montant", "amount", "dépense", "depense", "sortie"];
  for (let i = 0; i < lowerHeaders.length; i++) {
    if (amountPatterns.some(p => lowerHeaders[i].includes(p))) {
      config.amountColumn = i;
      console.log(`Amount column detected by header at index ${i}: "${headers[i]}"`);
      break;
    }
  }
  
  // If no amount column found, try generic patterns
  if (config.amountColumn === undefined) {
    const genericPatterns = ["€", "eur", "somme", "valeur"];
    for (let i = 0; i < lowerHeaders.length; i++) {
      if (genericPatterns.some(p => lowerHeaders[i].includes(p))) {
        config.amountColumn = i;
        console.log(`Amount column detected by generic pattern at index ${i}: "${headers[i]}"`);
        break;
      }
    }
  }
  
  // Content-based detection as fallback if headers didn't work
  if (rows && rows.length > 0) {
    console.log("=== CONTENT-BASED DETECTION ===");
    console.log("First data row:", rows[0]);
    
    // Detect date by content (look for date-like values)
    if (config.dateColumn === undefined) {
      for (let i = 0; i < (rows[0]?.length || 0); i++) {
        const cell = rows[0][i]?.trim() || "";
        if (isDateLike(cell)) {
          config.dateColumn = i;
          console.log(`Date column detected by content at index ${i}: "${cell}"`);
          break;
        }
      }
    }
    
    // Detect amount by content (look for number-like values with € or decimal)
    if (config.amountColumn === undefined) {
      for (let i = 0; i < (rows[0]?.length || 0); i++) {
        const cell = rows[0][i]?.trim() || "";
        if (isAmountLike(cell) && i !== config.dateColumn) {
          config.amountColumn = i;
          console.log(`Amount column detected by content at index ${i}: "${cell}"`);
          break;
        }
      }
    }
    
    // Detect label by content (longest text that's not date or amount)
    if (config.labelColumn === undefined) {
      let longestTextIndex = -1;
      let longestTextLength = 0;
      
      for (let i = 0; i < (rows[0]?.length || 0); i++) {
        if (i === config.dateColumn || i === config.amountColumn) continue;
        
        const cell = rows[0][i]?.trim() || "";
        if (cell.length > longestTextLength && !isDateLike(cell) && !isAmountLike(cell)) {
          longestTextLength = cell.length;
          longestTextIndex = i;
        }
      }
      
      if (longestTextIndex >= 0) {
        config.labelColumn = longestTextIndex;
        console.log(`Label column detected by content at index ${longestTextIndex}: "${rows[0][longestTextIndex]}"`);
      }
    }
  }
  
  console.log("=== DETECTION RESULT ===", config);
  return config;
}

/**
 * Check if a string looks like a date
 */
function isDateLike(value: string): boolean {
  if (!value) return false;
  // Check for date patterns: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YY, etc.
  return /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/.test(value) ||
         /^\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}$/.test(value) ||
         /^\d{1,2}[\-\s][a-zéûô]+[\-\s]\d{2,4}$/i.test(value);
}

/**
 * Check if a string looks like an amount
 */
function isAmountLike(value: string): boolean {
  if (!value) return false;
  // Check for amount patterns: 123,45 or -123.45 or 1 234,56 €
  const cleaned = value.replace(/[\s€$£EUR]/gi, "").trim();
  return /^[\-\+]?\d+[,\.]\d{2}$/.test(cleaned) ||
         /^[\-\+]?\d{1,3}([.\s]\d{3})*[,]\d{2}$/.test(cleaned) ||
         /^\(\d+[,\.]\d{2}\)$/.test(cleaned);
}
