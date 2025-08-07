import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { tblUserTable } from '../db/schema';
import { checkUserExists } from '../handlers/check_user_exists';

describe('checkUserExists', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return false for both checks when no users exist', async () => {
    const result = await checkUserExists('testuser', 'test@example.com');

    expect(result.usernameExists).toBe(false);
    expect(result.emailExists).toBe(false);
  });

  it('should return true for username when username exists', async () => {
    // Create a test user
    await db.insert(tblUserTable)
      .values({
        username: 'existinguser',
        email: 'existing@example.com',
        password_hash: 'hashedpassword123'
      })
      .execute();

    const result = await checkUserExists('existinguser', 'different@example.com');

    expect(result.usernameExists).toBe(true);
    expect(result.emailExists).toBe(false);
  });

  it('should return true for email when email exists', async () => {
    // Create a test user
    await db.insert(tblUserTable)
      .values({
        username: 'testuser',
        email: 'existing@example.com',
        password_hash: 'hashedpassword123'
      })
      .execute();

    const result = await checkUserExists('differentuser', 'existing@example.com');

    expect(result.usernameExists).toBe(false);
    expect(result.emailExists).toBe(true);
  });

  it('should return true for both when both username and email exist', async () => {
    // Create a test user
    await db.insert(tblUserTable)
      .values({
        username: 'existinguser',
        email: 'existing@example.com',
        password_hash: 'hashedpassword123'
      })
      .execute();

    const result = await checkUserExists('existinguser', 'existing@example.com');

    expect(result.usernameExists).toBe(true);
    expect(result.emailExists).toBe(true);
  });

  it('should handle case sensitivity correctly for usernames', async () => {
    // Create a test user with lowercase username
    await db.insert(tblUserTable)
      .values({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword123'
      })
      .execute();

    // Check with different case - should not match (case sensitive)
    const result = await checkUserExists('TestUser', 'different@example.com');

    expect(result.usernameExists).toBe(false);
    expect(result.emailExists).toBe(false);
  });

  it('should handle multiple users correctly', async () => {
    // Create multiple test users
    await db.insert(tblUserTable)
      .values([
        {
          username: 'user1',
          email: 'user1@example.com',
          password_hash: 'hashedpassword123'
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password_hash: 'hashedpassword456'
        },
        {
          username: 'user3',
          email: 'user3@example.com',
          password_hash: 'hashedpassword789'
        }
      ])
      .execute();

    // Test checking against one existing user
    const result1 = await checkUserExists('user2', 'nonexistent@example.com');
    expect(result1.usernameExists).toBe(true);
    expect(result1.emailExists).toBe(false);

    // Test checking against different existing email
    const result2 = await checkUserExists('nonexistentuser', 'user3@example.com');
    expect(result2.usernameExists).toBe(false);
    expect(result2.emailExists).toBe(true);

    // Test checking against completely non-existent data
    const result3 = await checkUserExists('nonexistentuser', 'nonexistent@example.com');
    expect(result3.usernameExists).toBe(false);
    expect(result3.emailExists).toBe(false);
  });

  it('should handle empty strings correctly', async () => {
    // Create a test user
    await db.insert(tblUserTable)
      .values({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword123'
      })
      .execute();

    const result = await checkUserExists('', '');

    expect(result.usernameExists).toBe(false);
    expect(result.emailExists).toBe(false);
  });

  it('should correctly identify when different users have the searched username and email', async () => {
    // Create two users - one with the username we're looking for, another with the email
    await db.insert(tblUserTable)
      .values([
        {
          username: 'searchuser',
          email: 'user1@example.com',
          password_hash: 'hashedpassword123'
        },
        {
          username: 'differentuser',
          email: 'search@example.com',
          password_hash: 'hashedpassword456'
        }
      ])
      .execute();

    const result = await checkUserExists('searchuser', 'search@example.com');

    expect(result.usernameExists).toBe(true);
    expect(result.emailExists).toBe(true);
  });
});