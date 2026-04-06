const mongoose = require("mongoose");
const Course = require("../model/Course");
const Enrollment = require("../model/Enrollment");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, category, level, tags, sections } = req.body;

  if (!title || !description || !price || !category) {
    throw new ApiError(400, "Missing required fields");
  }

  if (!req.file) {
    throw new ApiError(400, "Thumbnail image is required");
  }

  // Parse sections if they are sent as a string (common with FormData)
  let parsedSections = [];
  if (sections) {
    try {
      parsedSections = typeof sections === "string" ? JSON.parse(sections) : sections;
    } catch (error) {
      throw new ApiError(400, "Invalid sections format");
    }
  }

  // Get thumbnail URL - Cloudinary sets .path, local storage needs manual URL
  const thumbnailUrl = req.file.path || `/uploads/${req.file.filename}`;

  const newCourse = await Course.create({
    title,
    description,
    price: Number(price),
    category,
    level: level || "Beginner",
    tags: tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : [],
    thumbnail: thumbnailUrl,
    creator: req.user._id,
    sections: parsedSections
  });

  if (!newCourse) {
    throw new ApiError(500, "Failed to create course");
  }

  return res.status(201).json({
    success: true,
    message: "Course created successfully",
    course: newCourse,
  });
});

exports.getAllCourses = asyncHandler(async (req, res) => {
  const query = { isDeleted: false, status: "published" };
  const courses = await Course.find(query)
    .populate("creator", "firstName email photoUrl")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "Courses fetched successfully",
    count: courses.length,
    courses,
  });
});

exports.getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ creator: req.user._id, isDeleted: false })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "Instructor courses fetched successfully",
    courses,
  });
});

exports.getInstructorStats = asyncHandler(async (req, res) => {
  const courses = await Course.find({ creator: req.user._id });
  const totalCourses = courses.length;

  const mongoId = new mongoose.Types.ObjectId(req.user._id);

  // Aggregate stats from real Enrollments
  const stats = await Enrollment.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseInfo"
      }
    },
    { $unwind: "$courseInfo" },
    {
      $match: {
        "courseInfo.creator": mongoId
      }
    },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: 1 },
        totalEarnings: { $sum: "$courseInfo.price" }
      }
    }
  ]);

  const result = stats[0] || { totalStudents: 0, totalEarnings: 0 };

  res.status(200).json({
    success: true,
    stats: {
      totalCourses,
      totalStudents: result.totalStudents,
      totalEarnings: result.totalEarnings
    }
  });
});

// ✅ Get all courses by a specific instructor (Public)
exports.getInstructorPublicCourses = asyncHandler(async (req, res) => {
  const { instructorId } = req.params;
  
  const courses = await Course.find({ 
    creator: instructorId, 
    isDeleted: false, 
    status: "published" 
  }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: courses.length, courses });
});

exports.getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("creator", "firstName email photoUrl");

  if (!course || course.isDeleted) {
    throw new ApiError(404, "Course not found");
  }

  return res.status(200).json({
    success: true,
    message: "Course details fetched successfully",
    course,
  });
});

exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Admin bypass or ownership check
  const isAdmin = req.user.role === 'admin';
  const isCreator = course.creator.toString() === req.user._id.toString();
  
  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "Unauthorized to update this course");
  }

  const { title, description, price, category, level, tags, sections } = req.body;

  const updateData = {
    title: title || course.title,
    description: description || course.description,
    price: price ? Number(price) : course.price,
    category: category || course.category,
    level: level || course.level,
    tags: tags ? (typeof tags === "string" ? JSON.parse(tags) : tags) : course.tags,
    sections: sections ? (typeof sections === "string" ? JSON.parse(sections) : sections) : course.sections
  };

  if (req.file) {
    updateData.thumbnail = req.file.path || `/uploads/${req.file.filename}`;
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "Course updated successfully",
    course: updatedCourse,
  });
});

// ✅ Soft DELETE Course
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Admin bypass or ownership check
  const isAdmin = req.user.role === 'admin';
  const isCreator = course.creator.toString() === req.user._id.toString();
  
  if (!isAdmin && !isCreator) {
    throw new ApiError(403, "Unauthorized to delete this course");
  }

  // Soft delete logic
  course.isDeleted = true;
  course.status = "archived";
  await course.save();

  return res.status(200).json({
    success: true,
    message: "Course archived successfully (Soft Deleted)",
  });
});
