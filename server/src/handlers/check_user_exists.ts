import { db } from '../db';
import { tblUserTable } from '../db/schema';
import { eq, or } from 'drizzle-orm';

export async function checkUserExists(username: string, email: string): Promise<{ usernameExists: boolean; emailExists: boolean }> {
  try {
    // Query to check if either username or email exists
    const existingUsers = await db.select({
      username: tblUserTable.username,
      email: tblUserTable.email
    })
      .from(tblUserTable)
      .where(
        or(
          eq(tblUserTable.username, username),
          eq(tblUserTable.email, email)
        )
      )
      .execute();

    // Check which fields exist by examining the results
    const usernameExists = existingUsers.some(user => user.username === username);
    const emailExists = existingUsers.some(user => user.email === email);

    return {
      usernameExists,
      emailExists
    };
  } catch (error) {
    console.error('User existence check failed:', error);
    throw error;
  }
}