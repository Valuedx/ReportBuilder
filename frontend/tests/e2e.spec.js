import { test, expect } from '@playwright/test'

const backendBase = process.env.BACKEND_BASE_URL || 'http://127.0.0.1:8000/api'

test.describe('End-to-end: register, login, basic navigation', () => {
  test('register -> login -> dashboard', async ({ page, request }) => {
    const unique = Date.now()
    const email = `user${unique}@example.com`
    const username = `user${unique}`
    const password = 'Passw0rd!'

    // Wait for backend to be reachable (retry up to ~10s)
    let ok = false
    for (let i = 0; i < 20; i++) {
      const res = await request.get(`${backendBase}/auth/me/`, { failOnStatusCode: false })
      if ([200, 401].includes(res.status())) {
        ok = true
        break
      }
      await page.waitForTimeout(500)
    }
    expect(ok).toBeTruthy()

    // Register via backend
    const reg = await request.post(`${backendBase}/auth/register/`, {
      data: {
        email,
        username,
        first_name: 'Test',
        last_name: 'User',
        password,
      },
    })
    expect(reg.ok()).toBeTruthy()

    // Visit app
    await page.goto('/')
    await expect(page.getByText('Enterprise Report Builder')).toBeVisible()

    // Go to login page
    await page.goto('/login')
    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Should land on dashboard
    await expect(page.getByText('Enterprise Report Builder')).toBeVisible()

    // Navigate to Report Builder
    await page.getByRole('link', { name: 'Report Builder' }).click()
    await expect(page).toHaveURL(/.*\/report-builder/)
  })
})


