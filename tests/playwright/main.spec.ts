import { test, expect } from '@playwright/test';

const URL = 'http://localhost:5173/';
//const URL = 'https://northwind-kmvx.pages.dev/';

test('has title', async ({ page }) => {
  await page.goto(URL);
  await expect(page).toHaveTitle(/Northwind/);
});

test('filter field', async ({ page }) => {
  await page.goto(URL);
  const filterText = page.getByText('Filter', { exact: true });
  await expect(filterText).toHaveCount(0);
  await page.getByText('Employees').click();
  await expect(filterText).toHaveCount(1);
  console.log('Filters count', await filterText.count());
  await expect(filterText).toBeVisible();
});
