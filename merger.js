const PDFMerger = require("pdf-merger-js");

async function mergerpdf(pdfBuffers) {
  const merger = new PDFMerger();

  // Add each PDF buffer to the merger
  for (const buffer of pdfBuffers) {
    await merger.add(buffer);
  }

  // Merge PDFs and return the buffer
  return await merger.saveAsBuffer();
}

module.exports = { mergerpdf };
