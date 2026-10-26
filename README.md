# Travancore Devaswom Board (TDB) - Vazhipadu Booking System

A React 18+ and TypeScript (strict mode) application built with Vite, Tailwind CSS, and Vitest for booking temple vazhipadu (sacred offerings) across Travancore Devaswom Board temples.

---

## 🏛️ Project Architecture & Modules

The application is structured across five progressive modules according to engineering assessment specifications:
- **P1: Offerings List & Search**: Temple selection, real-time offering search, active/inactive filtering, responsive loading skeletons, and retryable error recovery.
- **P2: Offering Cart & Devotee Order Form**: Itemized cart with quantity management, Indian Rupee calculations, localStorage persistence, and devotee details validation (27 Vedic nakshatras, 10-digit mobile, future date constraint).
- **P3: Order Confirmation**: Atomic order submission through the mock API, double-click debounce protection, failure state preservation, and printable confirmation receipts.
- **P4: Staff Orders Registry**: Tabular registry with pagination, date & confirmation status filters, phone number search, URL query parameter persistence across refreshes, and in-place order cancellation.
- **P5: Mobile & Accessibility**: Full responsiveness on 360px mobile viewports (zero horizontal scrolling), 100% keyboard-navigable booking flow, ARIA-labeled inputs with screen-reader announced error alerts, and WCAG AA contrast compliance.

---

## 📦 Pull Requests & Git History

Each problem was developed on an isolated feature branch, reviewed with line-level code comments, and merged into `main`:

| Problem | Description | Feature Branch | Pull Request Link |
|---|---|---|---|
| **P1** | Offerings List, Search, and Error Retry | `feature/p1-offerings-list` | [#1 PR Link](https://github.com/manojram1/tdb-vazhipadu-frontend/pull/1) |
| **P2** | Offering Cart, Rupee Totals & Devotee Form | `feature/p2-cart-and-form` | [#2 PR Link](https://github.com/manojram1/tdb-vazhipadu-frontend/pull/2) |
| **P3** | Order Confirmation & Double-Click Guard | `feature/p3-order-confirmation` | [#3 PR Link](https://github.com/manojram1/tdb-vazhipadu-frontend/pull/3) |
| **P4** | Staff Orders Registry & Cancellation | `feature/p4-orders-list` | [#4 PR Link](https://github.com/manojram1/tdb-vazhipadu-frontend/pull/4) |
| **P5** | Mobile Responsiveness & WCAG Accessibility | `feature/p5-mobile-accessibility` | [#5 PR Link](https://github.com/manojram1/tdb-vazhipadu-frontend/pull/5) |

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
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Automated Test Suite
```bash
npm test
```
Runs 26 automated tests spanning API simulation, component rendering, cart math, form validation, debounce guards, URL state sync, and keyboard accessibility.

### Building for Production
```bash
npm run build
```
Executes `tsc` (strict TypeScript validation) and Vite bundling with 0 warnings or errors.

---

## ♿ Keyboard Walkthrough (Mouse-Free Booking)

The entire vazhipadu booking flow can be completed using the keyboard alone:
1. **Temple Selection**: Press <kbd>Tab</kbd> to focus a temple card, then press <kbd>Enter</kbd> or <kbd>Space</kbd> to select.
2. **Search Offerings**: Press <kbd>Tab</kbd> to reach the search field, type keywords (e.g. `push`), and press <kbd>Tab</kbd> into the filtered offering list.
3. **Add Offerings to Cart**: Navigate to any offering's "Add to Booking" button using <kbd>Tab</kbd>, and press <kbd>Enter</kbd> to increment quantity.
4. **Fill Devotee Form**: Press <kbd>Tab</kbd> through the devotee inputs:
   - Full Name: Type devotee name
   - Mobile: Type 10-digit number
   - Birth Star: Use <kbd>Arrow Down</kbd> / <kbd>Arrow Up</kbd> to select one of the 27 Nakshatras
   - Date: Select an offering date
5. **Submit Order**: <kbd>Tab</kbd> to "Place Order" and press <kbd>Enter</kbd>.
6. **Confirmation Modal**: Sacred receipt is announced. Press <kbd>Escape</kbd> to dismiss the receipt dialog and return to the main portal.

---

## 🔌 In-Memory Typed Mock API (`src/api/`)

- Latency simulation: random **200ms – 1000ms** per network call.
- Configurable failure rate: default **10%** simulated network error.
- Seed data: 3 consecrated temples, 27 offerings (active & inactive), and 50 initial bookings.
- Supported operations:
  - `getTemples()`
  - `getOfferings(templeId)`
  - `createOrder(request)`
  - `getOrders(query)`
  - `cancelOrder(orderId)`

---

## 📜 License
MIT © 2026 Travancore Devaswom Board (TDB)
