const PDFMerger = require("pdf-merger-js");

const mergerpdf = async (pdfPaths, outputPath) => {
  try {
    const merger = new PDFMerger();

    // Add each PDF to the merger
    for (const pdfPath of pdfPaths) {
      await merger.add(pdfPath);
    }

    // Save the merged PDF to the specified path
    await merger.save(outputPath);

    return outputPath;
  } catch (error) {
    console.error("Error in mergerpdf:", error);
    throw error;
  }
};

module.exports = { mergerpdf };
