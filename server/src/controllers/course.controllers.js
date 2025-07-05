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
