import { test, expect } from '@playwright/test';

type User = { id: number; name: string; email: string };

test('GET /users return with valid users', async ({ request }) => {
  const response = await request.get('/users');

  expect(response.status()).toBe(200);
  const users: User[] = await response.json();
  expect(users.length).toBeGreaterThan(0);

  for (const user of users) {
    console.log(`${user.name} | ${user.email}`)
  }

  expect(users[0].email).toContain('@');
});

