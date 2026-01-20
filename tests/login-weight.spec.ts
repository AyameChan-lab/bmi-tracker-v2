import { test, expect } from '@playwright/test';

// Helper to generate unique user
const generateUser = () => {
  const timestamp = Date.now();
  return {
    email: `test-${timestamp}-${Math.floor(Math.random() * 1000)}@example.com`,
    password: 'password123',
    name: `Test User ${timestamp}`
  };
};

test.describe('Login and Weight Input Flow', () => {

  test('User can register, login, and add weight entry', async ({ page }) => {
    const user = generateUser();

    // 1. Register first (to ensure we are logged in with a fresh user)
    await page.goto('/register');
    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Ensure we are on home page
    await expect(page).toHaveURL('/');
    await expect(page.getByText(`Welcome back, ${user.name}`)).toBeVisible();

    // 2. Add BMI Entry (Weight Input)
    const weight = '65';
    const height = '170';
    
    // Fill form
    await page.getByLabel('Weight (kg)').fill(weight);
    await page.getByLabel('Height (cm)').fill(height);
    
    // Verify real-time calculation
    // BMI = 65 / (1.7 * 1.7) = 65 / 2.89 = 22.49
    await expect(page.getByText('22.49')).toBeVisible();
    await expect(page.getByText('Normal weight')).toBeVisible();

    // Submit
    await page.getByRole('button', { name: 'Save Entry' }).click();

    // Verify inputs cleared (weight) but height remains
    await expect(page.getByLabel('Weight (kg)')).toHaveValue('');
    await expect(page.getByLabel('Height (cm)')).toHaveValue(height);
  });

});
