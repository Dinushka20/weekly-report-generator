import { test, expect } from '@playwright/test';

test.describe('Weekly Report System E2E Suite', () => {
  const timestamp = Date.now();
  const managerEmail = `manager_${timestamp}@test.com`;
  const memberEmail = `member_${timestamp}@test.com`;
  const password = 'password123';
  const projectName = `E2E Project ${timestamp}`;

  test('Should perform full authentication, project CRUD, report submission, and approval flow', async ({ page }) => {
    // 1. REGISTER MANAGER
    await page.goto('/register');
    await page.fill('input[name="firstName"]', 'ManagerFirstName');
    await page.fill('input[name="lastName"]', 'ManagerLastName');
    await page.fill('input[name="email"]', managerEmail);
    await page.fill('input[name="password"]', password);
    await page.selectOption('select[name="role"]', 'MANAGER');
    await page.click('button[type="submit"]');

    // Wait for redirect to login
    await page.waitForURL('**/login');
    await expect(page.locator('h2')).toContainText('Sign in to account');

    // 2. LOGIN MANAGER
    await page.fill('input[type="email"]', managerEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.locator('span:has-text("ManagerFirstName")')).toBeVisible();

    // 3. PROJECT CRUD
    // Navigate to Projects page
    await page.click('a[href="/projects"]');
    await page.waitForURL('**/projects');

    // Create New Project
    await page.click('button:has-text("New Project")');
    await page.fill('input[name="name"]', projectName);
    await page.fill('input[name="description"]', 'This is a test project created by Playwright.');
    await page.selectOption('select[name="status"]', 'ACTIVE');
    await page.click('button:has-text("Save")');

    // Verify Project Created
    await page.waitForSelector(`td:has-text("${projectName}")`);
    await expect(page.locator(`td:has-text("${projectName}")`)).toBeVisible();

    // Edit Project
    // Click edit button for the project (it's the button with FiEdit2 icon in the table row)
    const row = page.locator(`tr:has-text("${projectName}")`);
    await row.locator('button').first().click(); // first button is Edit
    await page.selectOption('select[name="status"]', 'ON_HOLD');
    await page.click('button:has-text("Save")');

    // Verify Project Edited
    await expect(row.locator('span.badge')).toContainText('ON HOLD');

    // Logout Manager
    await page.click('button.sidebar-logout');
    await page.waitForURL('**/login');

    // 4. REGISTER MEMBER
    await page.goto('/register');
    await page.fill('input[name="firstName"]', 'MemberFirstName');
    await page.fill('input[name="lastName"]', 'MemberLastName');
    await page.fill('input[name="email"]', memberEmail);
    await page.fill('input[name="password"]', password);
    await page.selectOption('select[name="role"]', 'MEMBER');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/login');

    // 5. LOGIN MEMBER
    await page.fill('input[type="email"]', memberEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.locator('span:has-text("MemberFirstName")')).toBeVisible();

    // 6. MEMBER WEEKLY REPORT OPERATIONS
    await page.click('a[href="/reports"]');
    await page.waitForURL('**/reports');

    // Open Form
    await page.click('button:has-text("New Report")');
    await page.fill('input[name="weekStart"]', '2026-07-01');
    await page.fill('input[name="weekEnd"]', '2026-07-07');
    await page.selectOption('select[name="projectId"]', { label: projectName });
    await page.fill('textarea[name="completedTasks"]', 'Completed E2E automated test features.');
    await page.fill('textarea[name="plannedTasks"]', 'Clean up code and write documentation.');
    await page.fill('textarea[name="blockers"]', 'Initial blockers resolved.');
    await page.fill('input[name="hoursWorked"]', '40');
    await page.fill('input[name="notes"]', 'Demo note.');

    // Save as DRAFT
    await page.click('button:has-text("Save Draft")');

    // Verify in history
    await page.waitForSelector('span.badge:has-text("DRAFT")');
    const reportRow = page.locator('tr:has-text("2026-07-01 — 2026-07-07")');
    await expect(reportRow).toBeVisible();

    // Edit Draft & Submit
    await reportRow.locator('button').first().click(); // click Edit
    await page.fill('textarea[name="blockers"]', 'No blockers now.');
    await page.click('button:has-text("Submit")');

    // Verify Status changed to SUBMITTED
    await page.waitForSelector('span.badge:has-text("SUBMITTED")');
    await expect(reportRow.locator('span.badge')).toContainText('SUBMITTED');

    // Logout Member
    await page.click('button.sidebar-logout');
    await page.waitForURL('**/login');

    // 7. MANAGER REPORT APPROVAL & FILTERING FLOW
    await page.fill('input[type="email"]', managerEmail);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    // Verify stats changed
    const recentReportRow = page.locator(`tr:has-text("MemberFirstName")`).filter({ hasText: projectName });
    await expect(recentReportRow).toBeVisible();

    // Test dashboard filtering
    // Select Project filter
    await page.selectOption('select:has(option:has-text("All Projects"))', { label: projectName });
    // Select Member filter
    await page.selectOption('select:has(option:has-text("All Members"))', { label: 'MemberFirstName MemberLastName' });
    // Click Reset
    await page.click('span:has-text("Reset")');

    // Click Approve on the report
    await recentReportRow.locator('button:has-text("Approve")').click();

    // Verify Status changes to APPROVED in the table
    await expect(recentReportRow).toContainText('APPROVED');
  });
});
