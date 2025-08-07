import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { tblUserTable } from '../db/schema';
import { type RegisterUserInput } from '../schema';
import { registerUser } from '../handlers/register_user';
import { eq } from 'drizzle-orm';

// Test input for user registration
const testInput: RegisterUserInput = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'securepassword123'
};

describe('registerUser', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should register a new user successfully', async () => {
    const result = await registerUser(testInput);

    // Verify response structure
    expect(result.success).toBe(true);
    expect(result.message).toBe('User registered successfully');
    expect(result.user).toBeDefined();
    
    // Verify user data
    expect(result.user!.username).toBe('testuser');
    expect(result.user!.email).toBe('test@example.com');
    expect(result.user!.id).toBeDefined();
    expect(result.user!.created_at).toBeInstanceOf(Date);
    expect(result.user!.created_at).toBeInstanceOf(Date);
  });

  it('should save user to database with hashed password', async () => {
    const result = await registerUser(testInput);

    // Query database to verify user was saved
    const users = await db.select()
      .from(tblUserTable)
      .where(eq(tblUserTable.id, result.user!.id))
      .execute();

    expect(users).toHaveLength(1);
    const savedUser = users[0];
    
    expect(savedUser.username).toBe('testuser');
    expect(savedUser.email).toBe('test@example.com');
    expect(savedUser.password_hash).toBeDefined();
    expect(savedUser.password_hash).not.toBe('securepassword123'); // Should be hashed
    expect(savedUser.password_hash.length).toBeGreaterThan(20); // Bcrypt hashes are long
    expect(savedUser.created_at).toBeInstanceOf(Date);
  });

  it('should verify password was hashed correctly', async () => {
    await registerUser(testInput);

    // Get the saved user
    const users = await db.select()
      .from(tblUserTable)
      .where(eq(tblUserTable.username, 'testuser'))
      .execute();

    const savedUser = users[0];
    
    // Verify the hashed password can be verified
    const isValidPassword = await Bun.password.verify('securepassword123', savedUser.password_hash);
    expect(isValidPassword).toBe(true);
    
    // Verify wrong password fails
    const isInvalidPassword = await Bun.password.verify('wrongpassword', savedUser.password_hash);
    expect(isInvalidPassword).toBe(false);
  });

  it('should reject duplicate username', async () => {
    // Register first user
    await registerUser(testInput);

    // Try to register another user with same username but different email
    const duplicateUsernameInput: RegisterUserInput = {
      username: 'testuser', // Same username
      email: 'different@example.com',
      password: 'anotherpassword123'
    };

    const result = await registerUser(duplicateUsernameInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Registration failed: Username already exists');
    expect(result.user).toBeUndefined();
  });

  it('should reject duplicate email', async () => {
    // Register first user
    await registerUser(testInput);

    // Try to register another user with same email but different username
    const duplicateEmailInput: RegisterUserInput = {
      username: 'differentuser',
      email: 'test@example.com', // Same email
      password: 'anotherpassword123'
    };

    const result = await registerUser(duplicateEmailInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Registration failed: Email already exists');
    expect(result.user).toBeUndefined();
  });

  it('should reject duplicate username and email', async () => {
    // Register first user
    await registerUser(testInput);

    // Try to register the exact same user
    const result = await registerUser(testInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Registration failed: Username and email already exist');
    expect(result.user).toBeUndefined();
  });

  it('should allow different users with unique credentials', async () => {
    // Register first user
    const result1 = await registerUser(testInput);
    expect(result1.success).toBe(true);

    // Register second user with different credentials
    const secondUserInput: RegisterUserInput = {
      username: 'seconduser',
      email: 'second@example.com',
      password: 'differentpassword123'
    };

    const result2 = await registerUser(secondUserInput);
    expect(result2.success).toBe(true);
    expect(result2.user!.username).toBe('seconduser');
    expect(result2.user!.email).toBe('second@example.com');

    // Verify both users exist in database
    const allUsers = await db.select().from(tblUserTable).execute();
    expect(allUsers).toHaveLength(2);
    
    const usernames = allUsers.map(u => u.username).sort();
    expect(usernames).toEqual(['seconduser', 'testuser']);
  });

  it('should handle edge case usernames and emails', async () => {
    const edgeCaseInput: RegisterUserInput = {
      username: 'a'.repeat(50), // Maximum length username
      email: 'very.long.email.address@example-domain.com',
      password: 'a'.repeat(100) // Maximum length password
    };

    const result = await registerUser(edgeCaseInput);

    expect(result.success).toBe(true);
    expect(result.user!.username).toBe('a'.repeat(50));
    expect(result.user!.email).toBe('very.long.email.address@example-domain.com');
  });
});