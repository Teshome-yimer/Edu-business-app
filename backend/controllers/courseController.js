const cloudinary = require('../utils/cloudinary');

const uploadMaterial = async(req, res) => {
    try {
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto', // Automatically detect file type
            folder: 'course_materials',
        });

        // Save result.secure_url to your database
        const course = await Course.findByIdAndUpdate(
            req.params.courseId, { $push: { materials: { title: req.body.title, fileUrl: result.secure_url } } }, { new: true }
        );

        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};