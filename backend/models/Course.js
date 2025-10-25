const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['programming', 'mathematics', 'science', 'business', 'arts', 'languages', 'other']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    thumbnail: {
        type: String,
        default: ''
    },
    materials: [{
        title: String,
        fileUrl: String,
        fileType: {
            type: String,
            enum: ['pdf', 'video', 'audio', 'document']
        },
        duration: Number, // for videos/audio in seconds
        uploadDate: {
            type: Date,
            default: Date.now
        },
        isFree: {
            type: Boolean,
            default: false
        }
    }],
    enrolledStudents: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    }],
    ratings: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    requirements: [String],
    learningOutcomes: [String],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    totalHours: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Update average rating when new rating is added
courseSchema.methods.updateAverageRating = function() {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
        return;
    }

    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
};

courseSchema.pre('save', function(next) {
    if (this.isModified('ratings')) {
        this.updateAverageRating();
    }
    next();
});

module.exports = mongoose.model('Course', courseSchema);