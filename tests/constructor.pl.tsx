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

    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Краторная булка/i })
    ).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('Белки, г')).toBeVisible();
    await expect(page.getByText('Жиры, г')).toBeVisible();
    await expect(page.getByText('Углеводы, г')).toBeVisible();
  });
});

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/**',
      notFound: 'fallback'
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

    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/auth/user') && response.status() === 200
    );
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

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/orders') && response.status() === 200
    );

    await expect(page.getByText('идентификатор заказа')).toBeVisible({
      timeout: 15000
    });

    await expect(page.locator('#modals h2')).toContainText(/[0-9]+/, {
      timeout: 15000
    });

    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.locator('#modals button').click();

    await expect(page.getByText('идентификатор заказа')).not.toBeVisible();
  });
});
