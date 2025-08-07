import { z } from 'zod';

// User schema for database records
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  password_hash: z.string(), // Stored as hashed password
  created_at: z.coerce.date() // Automatically converts string timestamps to Date objects
});

export type User = z.infer<typeof userSchema>;

// Input schema for user registration
export const registerUserInputSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password must be less than 100 characters')
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

// Response schema for successful registration
export const registerUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    created_at: z.coerce.date()
  }).optional() // User data returned only on success
});

export type RegisterUserResponse = z.infer<typeof registerUserResponseSchema>;