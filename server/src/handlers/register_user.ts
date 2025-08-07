import { db } from '../db';
import { tblUserTable } from '../db/schema';
import { type RegisterUserInput, type RegisterUserResponse } from '../schema';
import { eq, or } from 'drizzle-orm';

export async function registerUser(input: RegisterUserInput): Promise<RegisterUserResponse> {
  try {
    // 1. Check if username or email already exists
    const existingUser = await db.select()
      .from(tblUserTable)
      .where(
        or(
          eq(tblUserTable.username, input.username),
          eq(tblUserTable.email, input.email)
        )
      )
      .limit(1)
      .execute();

    if (existingUser.length > 0) {
      const existingUsername = existingUser[0].username === input.username;
      const existingEmail = existingUser[0].email === input.email;
      
      let message = 'Registration failed: ';
      if (existingUsername && existingEmail) {
        message += 'Username and email already exist';
      } else if (existingUsername) {
        message += 'Username already exists';
      } else {
        message += 'Email already exists';
      }
      
      return {
        success: false,
        message
      };
    }

    // 2. Hash the password securely
    const passwordHash = await Bun.password.hash(input.password, {
      algorithm: 'bcrypt',
      cost: 12
    });

    // 3. Insert the new user record
    const result = await db.insert(tblUserTable)
      .values({
        username: input.username,
        email: input.email,
        password_hash: passwordHash
      })
      .returning()
      .execute();

    const newUser = result[0];

    // 4. Return success response with user data (excluding password)
    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at
      }
    };
  } catch (error) {
    console.error('User registration failed:', error);
    throw error;
  }
}