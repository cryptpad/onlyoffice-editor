// @ts-check
import { test, expect } from '@playwright/test';

test('welcome page', async ({ page }) => {
    await page.goto('http://localhost/welcome/');

    await expect(page.getByText("GO TO TEST EXAMPLE")).toBeVisible();
});

// TODO enable this test, when the fork UI loads in the document editor context
test.fail('open docx', async ({ page }) => {
    await page.goto('http://localhost/example/editor?fileExt=docx');
    const frame = page.frameLocator('.form > iframe');

    await expect(frame.locator('#loadmask-spinner')).toBeAttached();
    await expect(frame.locator('#loadmask-spinner')).not.toBeAttached();
});
