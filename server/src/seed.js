/**
 * 🌱 Learnify Demo Seed Script
 * Creates demo users, initial courses, and dynamic enrollments for the platform.
 * Run with: npm run seed
 */

const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./model/user");
const Course = require("./model/Course");
const Enrollment = require("./model/Enrollment");
const connectDB = require("./config/db");

const DEMO_USERS = [
  {
    firstName: "Alice",
    lastName: "Student",
    email: "student@learnify.com",
    password: "Demo@1234",
    age: 22,
    gender: "female",
    role: "student",
    about: "Passionate learner exploring web development and cloud computing.",
    skills: ["JavaScript", "React", "HTML/CSS"],
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    isVerified: true,
  },
  {
    firstName: "Bob",
    lastName: "Instructor",
    email: "instructor@learnify.com",
    password: "Demo@1234",
    age: 35,
    gender: "male",
    role: "instructor",
    about: "Senior full-stack engineer with 10+ years of teaching experience.",
    skills: ["Node.js", "MongoDB", "System Design", "React", "AWS"],
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    isVerified: true,
  },
  {
    firstName: "Carol",
    lastName: "Admin",
    email: "admin@learnify.com",
    password: "Demo@1234",
    age: 30,
    gender: "female",
    role: "admin",
    about: "Platform administrator managing Learnify's ecosystem.",
    skills: ["Management", "Analytics", "Platform Operations"],
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    isVerified: true,
  },
];

const DEMO_COURSES = [
  {
    title: "Full-Stack Web Development Bootcamp",
    description: "Master Modern Web Development from scratch. Learn HTML, CSS, JavaScript, React, Node.js and MongoDB with hands-on projects.",
    price: 99.99,
    category: "Web Development",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    tags: ["JavaScript", "React", "Node.js"],
    sections: [
      {
        title: "Getting Started",
        lessons: [
          { title: "Introduction to Web", videoUrl: "https://res.cloudinary.com/demo/video/upload/v1631234567/sample.mp4", isFreePreview: true },
          { title: "Tools of the Trade", videoUrl: "https://res.cloudinary.com/demo/video/upload/v1631234567/sample.mp4" }
        ]
      }
    ]
  },
  {
    title: "Advanced React Design Patterns",
    description: "Take your React skills to the next level. Learn Compound Components, Render Props, HOCs, and Performance Optimization.",
    price: 149.99,
    category: "Web Development",
    level: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    tags: ["React", "Advanced", "Architecture"],
    sections: [
      {
        title: "The Provider Pattern",
        lessons: [
            { title: "Context API Deep Dive", videoUrl: "https://res.cloudinary.com/demo/video/upload/v1631234567/sample.mp4", isFreePreview: true }
        ]
      }
    ]
  },
  {
    title: "Data Science with Python",
    description: "Comprehensive guide to data analysis, visualization and machine learning using NumPy, Pandas, and Scikit-learn.",
    price: 79.99,
    category: "Data Science",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&q=80",
    tags: ["Python", "Data Science", "Machine Learning"],
    sections: [
        {
            title: "Data Analysis Basics",
            lessons: [
                { title: "Numpy Foundations", videoUrl: "https://res.cloudinary.com/demo/video/upload/v1631234567/sample.mp4", isFreePreview: true }
            ]
        }
    ]
  }
];

async function seed() {
  try {
    await connectDB();
    console.log("✅ Connected to database");

    // 1. Seed Core Users
    let instructorUser;
    let aliceStudent;
    for (const userData of DEMO_USERS) {
      let user = await User.findOne({ email: userData.email });

      if (!user) {
        user = await User.create(userData);
        console.log(`✅ Created [${user.role.toUpperCase()}]: ${user.firstName} ${user.lastName}`);
      } else {
        console.log(`⚠️  User exists: ${userData.email}`);
      }
      
      if (userData.email === 'instructor@learnify.com') instructorUser = user;
      if (userData.email === 'student@learnify.com') aliceStudent = user;
    }

    // 2. Seed Courses
    console.log("\n📦 Seeding courses...");
    const seededCourses = [];
    for (const courseData of DEMO_COURSES) {
      let course = await Course.findOne({ title: courseData.title });
      if (!course) {
        course = await Course.create({ ...courseData, creator: instructorUser._id });
        console.log(`✅ Created COURSE: ${courseData.title}`);
      } else {
        console.log(`⚠️  Course exists: ${courseData.title}`);
      }
      seededCourses.push(course);
    }

    // 3. Dynamic Enrollments (The "Visible" Data)
    console.log("\n👥 Seeding dynamic enrollments...");
    
    // Enroll Alice in all courses (if not already)
    for (const course of seededCourses) {
        const existing = await Enrollment.findOne({ user: aliceStudent._id, course: course._id });
        if (!existing) {
            await Enrollment.create({ user: aliceStudent._id, course: course._id });
            console.log(`✨ Enrolled Alice in: ${course.title}`);
        }
    }

    // Create 20 mock students and enroll them randomly to generate "Dynamic" revenue/stats
    console.log("🛠️ Generating 20 mock students for balanced stats...");
    for (let i = 1; i <= 20; i++) {
        const email = `student${i}@example.com`;
        let mockUser = await User.findOne({ email });
        
        if (!mockUser) {
            mockUser = await User.create({
                firstName: `Student_${i}`,
                lastName: "Learnify",
                email: email,
                password: "Demo@1234",
                role: "student",
                gender: i % 2 === 0 ? "male" : "female"
            });
        }

        // Enroll in random courses
        for (const course of seededCourses) {
            if (Math.random() > 0.3) { // 70% chance of enrollment
                const existing = await Enrollment.findOne({ user: mockUser._id, course: course._id });
                if (!existing) {
                    await Enrollment.create({ user: mockUser._id, course: course._id });
                }
            }
        }
    }

    // ✅ Batch Update: Ensure all courses have lifecycle flags (for older seeded data)
    console.log("\n🧴 Uplifting courses with lifecycle flags (status/isDeleted)...");
    await Course.updateMany(
        { $or: [ { status: { $exists: false } }, { isDeleted: { $exists: false } } ] }, 
        { $set: { status: "published", isDeleted: false } }
    );

    console.log("\n🎉 Dynamic Seed complete! All courses now have real-world lifecycle flags.");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
