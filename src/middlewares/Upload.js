const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedDocumentMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const allowedVideoMimeTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime" // .mov files
    ];

    const isImage = file.mimetype.startsWith("image/");
    const isDocument = allowedDocumentMimeTypes.includes(file.mimetype);
    const isVideo = allowedVideoMimeTypes.includes(file.mimetype);

    if (isImage || isDocument || isVideo) {
        cb(null, true);
    } else {
        cb(
            new Error("Only images, videos (MP4, WebM, MOV), and documents (PDF, DOC, DOCX) are allowed"),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit to accommodate videos
    }
});

module.exports = upload;