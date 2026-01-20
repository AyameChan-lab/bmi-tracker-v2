import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  
  test('Case 1: Homepage redirects to login', async ({ page }) => {
    // Visit homepage
    await page.goto('/');
    // Should be redirected to /login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Case 2: Login page has correct elements', async ({ page }) => {
    await page.goto('/login');
    
    // Check Title
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    
    // Check Inputs
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    
    // Check Button
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('Case 3: Can navigate from Login to Register', async ({ page }) => {
    await page.goto('/login');
    
    // Click Sign Up link
    await page.getByRole('link', { name: 'Sign Up' }).click();
    
    // Check URL
    await expect(page).toHaveURL(/.*\/register/);
    
    // Check Register Page Title
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
  });

  test('Case 4: Register page has correct elements', async ({ page }) => {
    await page.goto('/register');
    
    // Check Title
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
    
    // Check Inputs (Register has Name as well)
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    
    // Check Button
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('Case 5: Can navigate from Register to Login', async ({ page }) => {
    await page.goto('/register');
    
    // Click Sign In link
    await page.getByRole('link', { name: 'Sign In' }).click();
    
    // Check URL
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check Login Page Title
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

});
