const { z } = require("zod");

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number");

exports.signupSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: passwordRules,
  age: z.number().min(18, "Minimum age is 18").optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  photoUrl: z.string().url("Invalid photo URL").optional(),
  about: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

exports.loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password is required"),
});

exports.courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().min(0, "Price must be a number"),
  tags: z.array(z.string()).optional(),
});