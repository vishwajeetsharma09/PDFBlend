const { mergerpdf } = require("../merger");
const multer = require("multer");
const path = require("path");

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Create a function to handle the multipart form data
const multipartFormData = (req, res, next) => {
  upload.array("pdfs")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "Error processing files" });
    }
    next();
  });
};

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Process the multipart form data
    await new Promise((resolve, reject) => {
      multipartFormData(req, res, (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    if (!req.files || req.files.length < 2) {
      return res
        .status(400)
        .json({ error: "Please select at least 2 PDF files to merge" });
    }

    // Convert buffer to base64 for each PDF
    const pdfBuffers = req.files.map((file) => file.buffer);

    // Merge the PDFs in memory
    const mergedPdfBuffer = await mergerpdf(pdfBuffers);

    // Send the merged PDF as a response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=merged_${Date.now()}.pdf`
    );
    res.send(mergedPdfBuffer);
  } catch (error) {
    console.error("Error merging PDFs:", error);
    res.status(500).json({ error: "Error merging PDFs" });
  }
};
