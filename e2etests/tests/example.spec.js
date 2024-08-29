// @ts-check
import { test, expect } from '@playwright/test';

test('welcome page', async ({ page }) => {
    await page.goto('http://localhost/welcome/');

    await expect(page.getByText("GO TO TEST EXAMPLE")).toBeVisible();
});
