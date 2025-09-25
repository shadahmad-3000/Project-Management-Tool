const { DocumentService } = require("../services");

const uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const doc = await DocumentService.parseAndSavePDF(req.file);

    res.status(201).json({
      message: "PDF parsed and saved successfully",
      documentId: doc._id,
      preview: doc.content.substring(0, 200)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadDOCX = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const doc = await DocumentService.parseAndSaveDOCX(req.file);

    res.status(201).json({
      message: "DOCX parsed and saved successfully",
      documentId: doc._id,
      preview: doc.content.substring(0, 200)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const docs = await DocumentService.getAllDocuments();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const doc = await DocumentService.getDocumentById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    uploadPDF,
    uploadDOCX,
    getAllDocuments,
    getDocumentById
}
