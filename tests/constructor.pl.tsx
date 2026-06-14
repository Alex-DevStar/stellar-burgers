import { test, expect } from '@playwright/test';

const BUN_NAME = 'Краторная булка';
const MAIN_NAME = 'Биокотлета';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/constructor.har', {
      url: '**/api/**',
      notFound: 'fallback'
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('добавление ингредиента из списка в конструктор', async ({ page }) => {
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    const ingredientCard = page
      .locator('li')
      .filter({ has: page.getByText(MAIN_NAME) })
      .first();

    await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText(MAIN_NAME)).toHaveCount(2);
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    const ingredientCard = page
      .locator('li')
      .filter({ has: page.getByText(MAIN_NAME) })
      .first();

    await ingredientCard.getByText(MAIN_NAME).click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Биокотлета/i })
    ).toBeVisible();

    await page.locator('#modals button').last().click();

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('отображает данные именно того ингредиента, по которому кликнули', async ({
    page
  }) => {
    const ingredientCard = page
      .locator('li')
      .filter({ has: page.getByText(BUN_NAME) })
      .first();

    await ingredientCard.getByText(BUN_NAME).click();

    const modal = page.locator('#modals');

await expect(modal.getByText('Детали ингредиента')).toBeVisible();
await expect(
  modal.getByRole('heading', { name: /Краторная булка/i })
).toBeVisible();
await expect(modal.getByText('Калории, ккал')).toBeVisible();
await expect(modal.getByText('Белки, г')).toBeVisible();
await expect(modal.getByText('Жиры, г')).toBeVisible();
await expect(modal.getByText('Углеводы, г')).toBeVisible();
  });
});

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR('./tests/hars/constructor.har', {
      url: '**/api/ingredients',
      notFound: 'fallback'
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'alex.qa.1406@test.com',
            name: 'alex'
          }
        })
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: {
            number: 12345
          },
          name: 'test order'
        })
      });
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();

    const url = page.url();
    if (url && url.startsWith('http')) {
      await page.evaluate(() => {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
      });
    }
  });

  test('создание заказа: сборка бургера, открытие модалки с номером и очистка конструктора', async ({
    page
  }) => {
    const bunCard = page
      .locator('li')
      .filter({ has: page.getByText(BUN_NAME) })
      .first();

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page
      .locator('li')
      .filter({ has: page.getByText(MAIN_NAME) })
      .first();

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    const constructorArea = page.locator('section').filter({
      has: page.getByText('Оформить заказ')
    });

    await expect(constructorArea.getByText(BUN_NAME)).toHaveCount(2);
await expect(constructorArea.getByText(MAIN_NAME)).toHaveCount(1);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');

    await expect(modal.getByText('идентификатор заказа')).toBeVisible();
    await expect(modal.getByText('12345')).toBeVisible();

    await expect(constructorArea.getByText(BUN_NAME)).not.toBeVisible();
    await expect(constructorArea.getByText(MAIN_NAME)).not.toBeVisible();

    await modal.locator('button').click();

    await expect(modal.getByText('идентификатор заказа')).not.toBeVisible();
  });
});
