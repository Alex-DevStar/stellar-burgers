import { defineConfig, devices } from '@playwright/test';

/**
 * Конфиг Playwright для e2e-тестов.
 * Тесты лежат в папке tests
 * и имеют формат имени *.pl.tsx по ТЗ.
 */
export default defineConfig({
  // Папка, где лежат тесты
  testDir: './tests',

  // Явно говорим Playwright, какие файлы считать тестами
  // По ТЗ нужен именно формат constructor.pl.tsx
  testMatch: '**/*.pl.tsx',

  // Разрешаем параллельный запуск тестов
  fullyParallel: true,

  // Если в CI случайно оставить test.only — сборка упадёт
  forbidOnly: !!process.env.CI,

  // В CI можно дать пару повторных попыток
  retries: process.env.CI ? 2 : 0,

  // В CI ограничиваем количество воркеров
  workers: process.env.CI ? 1 : undefined,

  // Отчёт в html
  reporter: 'html',

  // Общие настройки для всех проектов
  use: {
    // Базовый адрес приложения
    // page.goto('/') будет открывать именно этот адрес
    baseURL: 'http://localhost:4000',

    // Трассировка только при повторной попытке упавшего теста
    trace: 'on-first-retry'
  },

  // Пока оставляем только Chromium,
  // чтобы не ловить сразу одинаковые ошибки в 3 браузерах.
  // Когда всё заработает — можно вернуть firefox и webkit.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Playwright сам поднимет dev-server перед тестами.
  // Это удобнее, чем держать отдельный терминал руками.
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI
  }
});
