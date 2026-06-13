import { test, expect } from '@playwright/test';

const BUN_NAME = 'Краторная булка';
const MAIN_NAME = 'Биокотлета';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Верни HAR после того, как добьёшь селекторы и убедишься,
    // что HAR не ломает загрузку страницы
    // await page.routeFromHAR('./tests/hars/constructor.har', {
    //   notFound: 'fallback'
    // });

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
    // Верни HAR после того, как добьёшь селекторы и проверишь,
    // что order.har записан корректно
    // await page.routeFromHAR('./tests/hars/order.har', {
    //   notFound: 'fallback'
    // });

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

  test.skip('создание заказа: сборка бургера, открытие модалки с номером и очистка конструктора', async ({
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

    await expect(page.getByText(/^[0-9]+$/)).toBeVisible();

await page.locator('#modals button').last().click();
    await expect(page.getByText(/^[0-9]+$/)).not.toBeVisible();
  });
});
