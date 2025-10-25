const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
exports.uploadFile = async(file, folder = 'edu-business') => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder,
            resource_type: 'auto',
            use_filename: true,
            unique_filename: false,
        });
        return result;
    } catch (error) {
        throw new Error(`Cloudinary upload error: ${error.message}`);
    }
};

// Delete file from Cloudinary
exports.deleteFile = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error(`Cloudinary delete error: ${error.message}`);
    }
};

module.exports = cloudinary;