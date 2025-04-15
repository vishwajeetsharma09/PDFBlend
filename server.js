const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
const { mergerpdf } = require("./merger");
const upload = multer({ dest: "uploads/" });
app.use("/static", express.static("public"));
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "template/index.html"));
});

app.post("/merge", upload.array("pdfs"), async function (req, res, next) {
  try {
    if (!req.files || req.files.length < 2) {
      return res
        .status(400)
        .send("Please select at least 2 PDF files to merge");
    }

    // Get full paths of all uploaded PDFs
    const pdfPaths = req.files.map((file) => path.join(__dirname, file.path));

    // Merge all PDFs
    await mergerpdf(pdfPaths);

    // Redirect to download the merged PDF
    res.redirect("/static/merged.pdf");
  } catch (error) {
    console.error("Error merging PDFs:", error);
    res.status(500).send("Error merging PDFs");
  }
});

app.listen(port, () => {
  console.log("server listening to port " + port);
});
