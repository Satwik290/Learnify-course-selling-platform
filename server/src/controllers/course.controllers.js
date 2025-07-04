const Course = require("../model/Course");
const { z } = require("zod");

// Zod validation schema
const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is too short"),
  price: z.number().min(0),
  tags: z.array(z.string()).optional(),
});

// Create Course Controller
exports.createCourse = async (req, res) => {
  try {
    // Validate text fields
    const body = courseSchema.parse({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    });

    // Image check
    if (!req.file) {
      return res.status(400).json({ error: "Thumbnail image is required" });
    }

    // Create course
    const newCourse = await Course.create({
      ...body,
      thumbnail: `/uploads/${req.file.filename}`,
      creator: req.user._id, // from auth middleware
    });

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to create course" });
  }
};
