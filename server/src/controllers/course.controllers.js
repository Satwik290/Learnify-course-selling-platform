const Course = require("../model/Course");
const { courseSchema } = require("../utlis/validators");

exports.createCourse = async (req, res) => {
  try {
    const body = courseSchema.parse({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    });

    if (!req.file) {
      return res.status(400).json({ error: "Thumbnail image is required" });
    }

    const newCourse = await Course.create({
      ...body,
      thumbnail: `/uploads/${req.file.filename}`,
      creator: req.user._id,
    });

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: err.errors || err.message || "Failed to create course",
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("creator", "firstName email")
      .sort({ createdAt: -1 }); 

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("creator", "firstName email");

    if (!course) return res.status(404).json({ error: "Course not found" });

    res.status(200).json({ course });
  } catch (error) {
    res.status(400).json({ error: "Invalid Course ID" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ error: "Course not found" });

    // 🛡️ Only creator can update
    if (course.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to update this course" });
    }

    // ✅ Validate with Zod
    const updatedFields = courseSchema.parse({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    });

    // Optional: update thumbnail
    if (req.file) {
      updatedFields.thumbnail = `/uploads/${req.file.filename}`;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Course updated", course: updatedCourse });
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ error: "Course not found" });

    // 🛡️ Check if current user is creator
    if (course.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete course" });
  }
};
