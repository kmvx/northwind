import { test, expect } from '@playwright/test';

const URL = 'http://localhost:5173/';
//const URL = 'https://kmvx.tk/northwind/';

test('has title', async ({ page }) => {
  await page.goto(URL);
  await expect(page).toHaveTitle(/Northwind/);
});

test('filter field', async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByText('Filter')).toHaveCount(0);
  await page.getByText('Employees').click();
  await expect(page.getByText('Filter')).toHaveCount(1);
  await expect(page.getByText('Filter')).toBeVisible();
});
