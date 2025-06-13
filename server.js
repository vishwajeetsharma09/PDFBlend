const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
const { mergerpdf } = require("./merger");
const fs = require("fs");

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Ensure public directory exists
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Serve static files from the public directory
app.use("/static", express.static(publicDir));
// Serve static files from the template directory
app.use(express.static(path.join(__dirname, "template")));

const port = 3000;

// API route for merging PDFs
app.post("/api/merge", upload.array("pdfs"), async function (req, res) {
  try {
    if (!req.files || req.files.length < 2) {
      return res
        .status(400)
        .json({ error: "Please select at least 2 PDF files to merge" });
    }

    // Create a temporary directory for processing
    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save uploaded files to temporary directory
    const pdfPaths = req.files.map((file, index) => {
      const filePath = path.join(tempDir, `file-${index}.pdf`);
      fs.writeFileSync(filePath, file.buffer);
      return filePath;
    });

    // Generate a unique filename for the merged PDF
    const timestamp = Date.now();
    const mergedFileName = `merged_${timestamp}.pdf`;
    const mergedFilePath = path.join(publicDir, mergedFileName);

    // Merge the PDFs
    await mergerpdf(pdfPaths, mergedFilePath);

    // Clean up temporary files
    pdfPaths.forEach((filePath) => fs.unlinkSync(filePath));

    // Send success response with the path to the merged PDF
    res.json({
      success: true,
      message: "PDFs merged successfully",
      pdfUrl: `/static/${mergedFileName}`,
    });
  } catch (error) {
    console.error("Error merging PDFs:", error);
    res.status(500).json({ error: "Error merging PDFs" });
  }
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "template/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
