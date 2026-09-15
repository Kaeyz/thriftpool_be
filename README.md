# 🧩 Thriftpool Backend Monorepo

This is the monorepo for **ThriftPool backend Apps**, built using **npm workspaces** and **TypeScript**. It contains multiple Apps and shared packages managed in a single repository for consistency, scalability, and ease of development.

---

## 📚 Table of Contents

- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Running the Project](#-running-the-project)
- [Configuration](#-configuration)
- [Scripts](#-scripts)
- [Linting & Type Checking](#-linting--type-checking)
- [Apps & Packages](#-Apps--packages)
- [Working on the Repository](#-working-on-the-repository)
- [API Documentation](#-api-documentation)
- [Technologies Used](#-technologies-used)
- [Contributing](#-contributing)

---

## 📁 Repository Structure

```

/
├── apps/
   ├── cp-server        # Main API server (Express + TypeScript)
├── packages/           # Shared TypeScript utilities and types
├── .eslintrc.js        # ESLint configuration
├── tsconfig.json       # Base TypeScript config
├── package.json        # Root with npm workspaces
└── README.md           # This file

````

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>=18.x`
- npm `>=8.x`

### Installation

```bash
pnpm install
cp .env.example .env
````

---

## 🔧 Running the Project

### Run All Apps

```bash
npm run dev
```

### Run a Specific Service

```bash
pnpm cp dev
```

---

## ⚙️ Configuration

Environment variables are defined in `.env` files (either at root of each service).

---

## 🧪 Linting & Type Checking

* Uses a shared **TypeScript** config at the root.
* Enforces code standards with **ESLint**.

```bash
npm run lint
```

---

## 📦 Apps & Packages

| Name              | Path                                                          | Description                          |
| ----------------  | ------------------------------------------------------------  | ------------------------------------ |
| **Community**     | [`/apps/cp-server`](./packages/community/README.md)           | REST API service using Express       |
| **Packages**      | [`/shared`](./shared/README.md)                               | Common types, utilities, and configs |

---

## 🛠️ Working on the Repository

### 🔀 Branching Strategy

* `main`: Production-ready, stable code.
* `dev`: Integration branch for ongoing development.
* `feat/*`, `fix/*`: Feature branches for individual changes.

### 🚧 Making Changes

1. **Pull latest changes**

   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Work on your changes**, then commit using similar structure `feat(main_service): add user signup endpoint`

4. **Push and open a Pull Request**

   * Target branch: `dev`
   * PR title: use conventional commit style (e.g., `feat(api): add user signup endpoint`)

5. **Wait for review and approval**

   * Ensure tests pass
   * Lint errors resolved
   * CI status green

---

## 📘 API Documentation

The REST API is documented using **OpenAPI (Swagger)**.
You can access the live API documentation here:

🔗 **[Community Server Api Docs](https://cp-api.thriftpool.com/docs)**

---

## 🛠️ Main Technologies Used

* **Monorepo Management**: npm workspaces
* **Language**: TypeScript
* **Linting**: ESLint
* **API**: Express.js
* **Test**: Jest
* **Websocket**: Socketio

---

## 🤝 Contributing

We welcome all contributions! Here's how to get started:

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/my-feature`
3. Commit your changes
4. Run `npm run lint && npm run build`
5. Submit a Pull Request

Please follow our commit conventions and keep PRs focused and well-documented.