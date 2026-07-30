# 🍔 Stellar Burgers

**Stellar Burgers** — одностраничное приложение (SPA) для создания и заказа бургеров.

Пользователь может зарегистрироваться, авторизоваться, собрать бургер с помощью Drag & Drop, оформить заказ, просматривать историю заказов и управлять своим профилем.

## 🚀 Demo

🌐 Live Demo: https://alex-devstar.github.io/stellar-burgers/

📦 Repository: https://github.com/Alex-DevStar/stellar-burgers

---

## ✨ Возможности

- 🍔 Конструктор бургеров 
- 🔐 Регистрация и авторизация пользователей
- 🔑 JWT-аутентификация (Access Token + Refresh Token)
- 👤 Личный кабинет пользователя
- ✏️ Редактирование данных профиля
- 📦 Создание заказов
- 📜 История заказов пользователя
- 📡 Получение данных с REST API
- 🛡️ Защищённые маршруты
- ♻️ Автоматическое обновление access token
- ⚡ Управление состоянием приложения через Redux Toolkit
- 📖 Документация компонентов в Storybook

---

## 🛠️ Стек технологий

### Frontend

- React
- TypeScript
- Redux Toolkit
- React Router
- CSS Modules
- Webpack

### Тестирование

- Jest
- Cypress

### Инструменты разработки

- ESLint
- Prettier
- Storybook
- GitHub Pages

---

## 📂 Архитектура

Проект организован по принципам **Feature-Sliced Design (FSD)**.

```
src
├── components
├── features
├── pages
├── services
├── utils
├── images
└── index.tsx
```

В приложении используются:

- функциональные компоненты React;
- строгая типизация TypeScript;
- Redux Toolkit;
- React Router;
- Feature-Sliced Design;
- переиспользуемые UI-компоненты;
- Storybook для разработки компонентов.

---

## 🔐 Авторизация

Реализована полноценная система аутентификации пользователей.

Функциональность включает:

- регистрацию;
- вход в систему;
- хранение Access Token в Cookie;
- хранение Refresh Token в LocalStorage;
- автоматическое обновление Access Token при истечении срока действия;
- защищённые маршруты;
- получение данных текущего пользователя;
- изменение данных профиля;
- выход из аккаунта.

---

## ⚙️ Запуск проекта

Установка зависимостей

```bash
npm install
```

Запуск приложения

```bash
npm start
```

Production-сборка

```bash
npm run build
```

---

## 📦 Доступные команды

```bash
npm start          # запуск приложения
npm run build      # production сборка
npm run lint       # ESLint
npm run format     # Prettier
npm run test       # Jest
npm run test:e2e   # playwright test
npm run storybook  # Storybook
```

---

## 🧪 Тестирование

Проект включает:

- unit-тесты (Jest);
- e2e-тесты (playwright);
- Storybook для разработки компонентов в изоляции.

---

## 💡 Что было реализовано

Во время разработки основное внимание уделялось:

- организации архитектуры приложения;
- работе с Redux Toolkit;
- реализации JWT-аутентификации;
- защищённой маршрутизации;
- работе с REST API;
- реализации конструктора;
- деплою приложения на GitHub Pages.

---

## 📈 Возможные улучшения

- Docker
- CI/CD
- Code Splitting
- Lazy Loading
- Повышение покрытия тестами
- Оптимизация производительности

---

## 👨‍💻 Автор

**Александр Чертков**

Frontend Developer (React / TypeScript)

GitHub: https://github.com/Alex-DevStar
