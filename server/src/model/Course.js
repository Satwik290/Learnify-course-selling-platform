const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: String, // e.g. "12:30"
  },
  isFreePreview: {
    type: Boolean,
    default: false,
  }
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      maxLength: 1000,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sections: [sectionSchema],
    category: {
      type: String,
      required: true,
      enum: ["Web Development", "Data Science", "Design", "Marketing", "Business", "Other"],
      default: "Other"
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    enrolledCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published"
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// ✅ Static method to sync enrolledCount from Enrollments
courseSchema.statics.syncEnrollmentCount = async function(courseId) {
  const Enrollment = mongoose.model("Enrollment");
  const count = await Enrollment.countDocuments({ course: courseId });
  await this.findByIdAndUpdate(courseId, { enrolledCount: count });
  return count;
};

module.exports = mongoose.model("Course", courseSchema);
