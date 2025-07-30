# 🚀 Order Management System - Automation Testing Framework

[![Playwright Tests](https://img.shields.io/badge/tests-playwright-green)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/language-typescript-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/runtime-node.js-brightgreen)](https://nodejs.org/)

A comprehensive end-to-end testing framework for the Order Management System built with Playwright, TypeScript, and modern testing practices.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Running Tests](#-running-tests)
- [Test Documentation](#test-documentation)
- [Contributing](#-contributing)

## 🎯 Overview

This automation testing framework provides comprehensive coverage for a full-stack Order Management System including:

- **Frontend**: React.js application with order management interface
- **Backend**: Express.js API server with RESTful endpoints
- **Database**: JSON-based data storage with file uploads

The framework implements modern testing practices with Page Object Model, test fixtures, schema validation, and detailed reporting.

## ✨ Features

### 🧪 **Test Coverage**
- ✅ User Authentication (Login/Register/Logout)
- ✅ Order CRUD Operations (Create/Read/Update/Delete)
- ✅ Form Validation & Error Handling
- ✅ File Upload Functionality
- ✅ API Response Validation
- ✅ End-to-End User Workflows
- ✅ Visual Regression Testing

### 🛠️ **Framework Features**
- 🎭 **Playwright** - Cross-browser automation
- 📝 **TypeScript** - Type safety and better IDE support
- 🏗️ **Page Object Model** - Maintainable test architecture
- 🔧 **Test Fixtures** - Reusable setup and teardown
- 📊 **Schema Validation** - API response verification
- 🎲 **Dynamic Test Data** - Faker.js integration
- 📈 **Rich Reporting** - HTML reports with screenshots and videos
- 👁️ **Visual Testing** - Screenshot comparison and regression detection

## 📁 Project Structure

```
automation-testing-playwright/
├── 📁 automation-tests/               # Main test directory
│   ├── 📁 data/                      # Test data and assets
│   │   ├── test-data.ts              # Static test data
│   │   ├── image.jpg                 # Test upload files
│   │   └── imageupdate.jpg
│   ├── 📁 fixtures/                  # Test fixtures
│   │   └── auth.fixture.ts           # Authentication setup
│   ├── 📁 pages/                     # Page Object Model
│   │   ├── base.page.ts              # Base page class
│   │   ├── login.page.ts             # Login page actions
│   │   ├── orders.page.ts            # Orders page actions
│   │   └── register.page.ts          # Registration actions
│   ├── 📁 schemas/                   # API response schemas
│   │   ├── auth.schemas.ts           # Auth validation schemas
│   │   └── order.schemas.ts          # Order validation schemas
│   ├── 📁 selectors/                 # Centralized selectors
│   │   └── app.selectors.ts          # Application selectors
│   ├── 📁 tests/                     # Test specifications
│   │   ├── 📁 api/                   # API tests
│   │   └── 📁 web/                   # Web UI tests
│   │       ├── 📁 auth/              # Authentication tests
│   │       │   └── login.spec.ts
│   │       ├── 📁 orders/            # Order management tests
│   │       │   ├── create-order.spec.ts
│   │       │   ├── update-order.spec.ts
│   │       │   ├── delete-order.spec.ts
│   │       │   ├── orders-list.spec.ts
│   │       │   └── complete-flow.spec.ts
│   │       └── 📁 visual/            # Visual regression tests
│   │           ├── login-page.visual.spec.ts
│   ├── 📁 types/                     # TypeScript definitions
│   │   └── order.types.ts
│   ├── 📁 utils/                     # Utility functions
│   │   ├── auth.ts
│   │   └── schemaValidator.ts
│   ├── playwright.config.ts          # Playwright configuration
│   └── package.json
├── 📁 backend/                       # Express.js API server
│   ├── server.js
│   ├── data.json
│   └── package.json
├── 📁 frontend/                      # React.js application
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── components/
│   ├── public/
│   └── package.json
└── README.md                         # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v7.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for browsers and dependencies

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd automation-testing-playwright
```

### 2. Install Dependencies

For the automation tests:
```bash
cd automation-tests
npm install
npx playwright install
```

For the application (if running locally):
```bash
# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 🚀 Quick Start

### 1. Start the Application
```bash
# Terminal 1 - Start Backend (Port 4000)
cd backend
node server.js

# Terminal 2 - Start Frontend (Port 3000)
cd frontend
npm start
```

### 2. Run Your First Test
```bash
cd automation-tests

# Run a single test
npx playwright test tests/web/auth/login.spec.ts

# Run with UI mode (recommended for first-time users)
npx playwright test --ui
```

### 3. View Test Results
```bash
# Open HTML report
npx playwright show-report
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests with UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test tests/web/orders/create-order.spec.ts

# Run visual tests only
npx playwright test tests/web/visual/

# Run tests in specific browser
npx playwright test --project=chromium

# Update visual baselines (when UI changes are intentional)
npx playwright test tests/web/visual/ --update-snapshots
```

## 🤝 Test Documentation
For the automation tests: https://drive.google.com/drive/folders/1izUngKzzuxlfF-aMdN4hEvlwT3tBWkln?usp=sharing

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request