const Imagekit = require("imagekit");

const imagekit = process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT
    ? new Imagekit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    })
    : null;

/**
 * Upload a file buffer to ImageKit
 * @param {Buffer} imageBuffer 
 * @param {string} fileName 
 * @param {string} folder - 
 */
async function uploadImage(imageBuffer, fileName, folder = "imcamhub-uploads") {
    if (!imagekit) {
        throw new Error("ImageKit credentials are not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.");
    }

    const response = await imagekit.upload({
        file: imageBuffer,
        fileName: fileName,
        folder: folder
    });
    return response;
}

module.exports = uploadImage;




/*const Imagekit = require("imagekit");

const imagekit = process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT
    ? new Imagekit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    })
    : null;

/**
 * Upload a file buffer to ImageKit
 * @param {Buffer} imageBuffer 
 * @param {string} fileName 
 * @param {string} folder - 
 */ 
/*async function uploadImage(imageBuffer, fileName, folder = "e2e-uploads") {
    if (!imagekit) {
        throw new Error("ImageKit credentials are not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.");
    }

    try {
        console.log(`[ImageKit Upload] Uploading file: ${fileName} to folder: ${folder}`);
        console.log(`[ImageKit Upload] File size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
        
        const response = await imagekit.upload({
            file: imageBuffer,
            fileName: fileName,
            folder: folder
        });
        
        console.log("[ImageKit Upload] Success!");
        console.log(`[ImageKit Upload] File ID: ${response.fileId}`);
        console.log(`[ImageKit Upload] URL: ${response.url}`);
        
        return response;
    } catch (error) {
        console.error("[ImageKit Upload] Failed:", error.message);
        throw error;
    }
}

// Added for cleaning up old processed images
async function deleteImage(fileId) {
    if (!imagekit) {
        console.warn("[ImageKit Delete] ImageKit not configured, skipping deletion");
        return;
    }
    
    try {
        console.log(`[ImageKit Delete] Deleting file with ID: ${fileId}`);
        await imagekit.deleteFile(fileId);
        console.log(`[ImageKit Delete] Successfully deleted file: ${fileId}`);
    } catch (error) {
        console.error(`[ImageKit Delete] Failed to delete file ${fileId}:`, error.message);
    }
}

module.exports = {
    uploadImage,
    deleteImage
};  */