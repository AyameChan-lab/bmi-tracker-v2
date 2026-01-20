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

test.describe('Functional Flow', () => {

  test('User can register and login', async ({ page }) => {
    const user = generateUser();
    
    // 1. Register
    await page.goto('/register');
    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // After successful register (and auto-login), should be on home page
    await expect(page).toHaveURL('/');
    await expect(page.getByText(`Welcome back, ${user.name}`)).toBeVisible();
  });

  test('User can add BMI entry', async ({ page }) => {
    const user = generateUser();

    // 1. Register first (to ensure we are logged in with a fresh user)
    await page.goto('/register');
    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Ensure we are on home page
    await expect(page).toHaveURL('/');

    // 2. Add BMI Entry
    const weight = '70';
    const height = '175';
    
    // Fill form
    await page.getByLabel('Weight (kg)').fill(weight);
    await page.getByLabel('Height (cm)').fill(height);
    
    // Verify real-time calculation
    // BMI = 70 / (1.75 * 1.75) = 22.86
    await expect(page.getByText('22.86')).toBeVisible();
    await expect(page.getByText('Normal weight')).toBeVisible();

    // Submit
    await page.getByRole('button', { name: 'Save Entry' }).click();

    // Verify inputs cleared (weight) but height remains
    await expect(page.getByLabel('Weight (kg)')).toHaveValue('');
    await expect(page.getByLabel('Height (cm)')).toHaveValue(height);
  });

});
