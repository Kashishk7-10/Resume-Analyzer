import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

/**
 * Parse different file types (TXT, PDF, DOC) and extract text
 * @param {string} uri - File URI from document picker
 * @param {string} mimeType - MIME type of file
 * @returns {Promise<string>} - Extracted text content
 */
export const parseFile = async (uri, mimeType) => {
  try {
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Route to appropriate parser
    if (mimeType === 'text/plain') {
      return parseTextFile(base64);
    } else if (
      mimeType === 'application/pdf' ||
      uri.toLowerCase().endsWith('.pdf')
    ) {
      return await parsePdfFile(base64);
    } else if (
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      uri.toLowerCase().endsWith('.doc') ||
      uri.toLowerCase().endsWith('.docx')
    ) {
      return await parseDocFile(base64, uri);
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

/**
 * Parse plain text file
 */
function parseTextFile(base64) {
  const buffer = Buffer.from(base64, 'base64');
  const text = buffer.toString('utf-8');
  return text.trim();
}

/**
 * Parse PDF file
 * Uses pdfjs-dist library
 */
async function parsePdfFile(base64) {
  try {
    // Dynamically import pdfjs
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
    
    // Set up worker from CDN
    if (typeof pdfjsLib.GlobalWorkerOptions !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    }

    const arrayBuffer = Buffer.from(base64, 'base64').buffer;
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str || '').join(' ');
        fullText += pageText + ' ';
      } catch (pageError) {
        console.warn(`Error parsing PDF page ${i}:`, pageError);
        continue;
      }
    }

    const cleaned = fullText.trim().replace(/\s+/g, ' ');
    if (cleaned.length === 0) {
      throw new Error('No readable text found in PDF');
    }
    return cleaned;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

/**
 * Parse Word document (.doc or .docx)
 * Uses mammoth library
 */
async function parseDocFile(base64, uri) {
  try {
    const mammoth = require('mammoth');
    const buffer = Buffer.from(base64, 'base64');

    // Mammoth handles both .doc and .docx
    const result = await mammoth.extractRawText({ buffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No readable text found in document');
    }
    
    return result.value.trim().replace(/\s+/g, ' ');
  } catch (error) {
    console.warn('Mammoth parsing failed, attempting fallback:', error.message);
    try {
      // Fallback: try to extract readable text from binary
      const buffer = Buffer.from(base64, 'base64');
      const text = buffer.toString('utf-8', 0, Math.min(buffer.length, 100000));
      const cleaned = text
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (cleaned.length > 50) {
        return cleaned;
      }
    } catch {}
    
    throw new Error(`Could not parse Word document: ${error.message}`);
  }
}

/**
 * Get file type from MIME type or extension
 */
export const getFileType = (mimeType, uri) => {
  if (mimeType === 'text/plain' || uri?.toLowerCase().endsWith('.txt')) {
    return 'Text File';
  } else if (
    mimeType === 'application/pdf' ||
    uri?.toLowerCase().endsWith('.pdf')
  ) {
    return 'PDF Document';
  } else if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    uri?.toLowerCase().endsWith('.doc') ||
    uri?.toLowerCase().endsWith('.docx')
  ) {
    return 'Word Document';
  }
  return 'Document';
};

/**
 * Validate file size (max 10MB)
 */
export const validateFileSize = (sizeInBytes) => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (sizeInBytes > MAX_SIZE) {
    throw new Error(`File too large. Maximum size is 10MB. Got ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`);
  }
};
