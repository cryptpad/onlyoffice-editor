// @ts-check
import { test, expect } from '@playwright/test';

test('welcome page', async ({ page }) => {
    await page.goto('http://localhost/welcome/');

    await expect(page.getByText("GO TO TEST EXAMPLE")).toBeVisible();
});

test('open docx', async ({ page }) => {
    await page.goto('http://localhost/example/editor?fileExt=docx');

    // await expect(page.locator('#id_target_cursor')).toBeAttached();
    await expect(page.locator('.asc-loadmask')).toBeAttached();

});
