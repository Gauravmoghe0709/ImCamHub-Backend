const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Only allow image types for dashboardImage
    const allowedImageMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    // For heroVideo, allow video types
    const allowedVideoMimeTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime"
    ];

    const isAllowedImage = allowedImageMimeTypes.includes(file.mimetype);
    const isAllowedVideo = allowedVideoMimeTypes.includes(file.mimetype);

    if (file.fieldname === "dashboardImage") {
        if (isAllowedImage) {
            cb(null, true);
        } else {
            cb(new Error("Invalid hero image format"), false);
        }
    } else if (file.fieldname === "heroVideo") {
        if (isAllowedVideo) {
            cb(null, true);
        } else {
            cb(new Error("Invalid video format"), false);
        }
    } else {
        cb(new Error("Unexpected field"), false);
    }
};

// Custom limits function to handle different file size limits per field
const limits = (req, file, cb) => {
    if (file.fieldname === "dashboardImage") {
        // 5MB limit for image
        cb(null, { fileSize: 5 * 1024 * 1024 });
    } else if (file.fieldname === "heroVideo") {
        // 50MB limit for video
        cb(null, { fileSize: 50 * 1024 * 1024 });
    } else {
        cb(null, { fileSize: 5 * 1024 * 1024 }); // Default to 5MB
    }
};

const heroSectionUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB as outer limit, will be enforced per-field
    }
});

module.exports = heroSectionUpload;
