const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
const { mergerpdf } = require("./merger");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

// Ensure public directory exists
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Serve static files from the public directory
app.use("/static", express.static(publicDir));
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "template/index.html"));
});

app.post("/merge", upload.array("pdfs"), async function (req, res, next) {
  try {
    if (!req.files || req.files.length < 2) {
      return res
        .status(400)
        .json({ error: "Please select at least 2 PDF files to merge" });
    }

    // Get full paths of all uploaded PDFs
    const pdfPaths = req.files.map((file) => path.join(__dirname, file.path));

    // Generate a unique filename for the merged PDF
    const timestamp = Date.now();
    const mergedFileName = `merged_${timestamp}.pdf`;
    const mergedFilePath = path.join(publicDir, mergedFileName);

    // Merge all PDFs
    await mergerpdf(pdfPaths, mergedFilePath);

    // Clean up uploaded files
    req.files.forEach((file) => {
      fs.unlinkSync(path.join(__dirname, file.path));
    });

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

app.listen(port, () => {
  console.log("server listening to port " + port);
});
