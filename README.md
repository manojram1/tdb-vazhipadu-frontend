# Travancore Devaswom Board (TDB) - Vazhipadu Booking System

A React 18+ and TypeScript (strict mode) application built with Vite, Tailwind CSS, and Vitest for booking temple vazhipadu (offerings) across Travancore Devaswom Board temples.

## 🏛️ Overview

A vazhipadu is a sacred ritual offering performed by temple priests on behalf of a devotee. This application simulates the booking lifecycle across 5 distinct problem modules:
- **P1: Offerings List**: Temple selection, real-time search, active/inactive filtering, loading, empty, and retryable error states.
- **P2: Offering Cart & Order Form**: Dynamic cart with rupee calculations, persistent localStorage, devotee details (27 nakshatras, phone validation, future date restriction).
- **P3: Order Confirmation**: Atomic order submission with double-click debounce, graceful network error recovery, and instant confirmation receipts.
- **P4: Staff Orders Management**: Tabular view of all bookings, filtering by date/status, phone number search, pagination with URL state persistence, and cancellation workflow.
- **P5: Mobile & Accessibility**: Responsive down to 360px viewport, full keyboard navigation, screen-reader accessible forms (ARIA), and WCAG AA contrast.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Running Tests
```bash
# Run all unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Building for Production
```bash
npm run build
```

---

## 🔌 Typed Mock API (`src/api/`)

The application features an in-memory typed network simulation module with:
- Simulated real-world latency: random **200ms – 1000ms** per request.
- Configurable failure rate: default **10%** network failure to test resilient error handling.
- Realistic seed data: **3 major temples** (Sabarimala, Ambalappuzha, Ettumanoor), **27 offerings** (active and inactive), and **50 initial seeded orders**.
- API operations:
  - `getTemples()`
  - `getOfferings(templeId)`
  - `createOrder(request)`
  - `getOrders(query)`
  - `cancelOrder(orderId)`

---

## 📦 Pull Requests & Git Workflow

Each problem is implemented on an isolated feature branch, reviewed with line-level commentary, and merged into `main`:

| Problem | Description | Feature Branch | Pull Request |
|---|---|---|---|
| **P1** | Offerings List & Search | `feature/p1-offerings-list` | *(Pending)* |
| **P2** | Cart & Order Form | `feature/p2-cart-and-form` | *(Pending)* |
| **P3** | Order Confirmation | `feature/p3-order-confirmation` | *(Pending)* |
| **P4** | Staff Orders List | `feature/p4-orders-list` | *(Pending)* |
| **P5** | Mobile & Accessibility | `feature/p5-mobile-accessibility` | *(Pending)* |

---

## 📜 License
MIT
