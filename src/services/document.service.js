const fs = require("fs");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const { Document } = require("../models/index");

class DocumentService{
    async parseAndSavePDF(file) {
    const dataBuffer = fs.readFileSync(file.path);
    const parsed = await pdfParse(dataBuffer);

    const doc = new Document({
      filename: file.originalname,
      content: parsed.text,
    });
    return await doc.save();
  }
  async parseAndSaveDOCX(file) {
    const result = await mammoth.extractRawText({ path: file.path });
    const text = result.value;

    const doc = new Document({
      filename: file.originalname,
      content: text,
    });
    return await doc.save();
  }
  async getAllDocuments() {
    return await Document.find().sort({ uploadedAt: -1 });
  }

  async getDocumentById(id) {
    return await Document.findById(id);
  }
};

module.exports = new DocumentService();