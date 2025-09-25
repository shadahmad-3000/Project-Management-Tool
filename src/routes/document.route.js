const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { DocumentController } = require("../controllers/index");


router.post("/uploadpdf", upload.single("file"), DocumentController.uploadPDF);
router.post("/uploaddocx", upload.single("file"), DocumentController.uploadDOCX);

router.get("/getalldocs", DocumentController.getAllDocuments);
router.get("getalldocsbyId/:id", DocumentController.getDocumentById);

module.exports = router;