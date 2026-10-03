# Lioc — Complete B2B Cleaning & Hygiene Digital Platform

Lioc is a manufacturing and direct-sales enterprise producing commercial-grade cleaning chemicals, disinfectants, and institutional hygiene products. This repository hosts the full-stack B2B digital salesperson, product catalog, and lead generation engine.

---


## 🏗️ Architecture & Technology Stack

* **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons
* **Backend:** FastAPI (Python 3.12), SQLAlchemy 2.0 ORM, Pydantic v2
* **Database:** PostgreSQL (production) / SQLite (zero-config local development)
* **Lead Tracking:** Automatic Reference Tracking IDs (`LQ-XXXXXX`, `LS-XXXXXX`, `LD-XXXXXX`, `LC-XXXXXX`)
* **Integrations:** Centralized WhatsApp dynamic messaging, context-aware prefilled inquiries

---

## 🚀 Quick Start Guide (Local Development)

This website requires **two separate processes** running at the same time: the **Backend API** and the **Frontend UI**.

### 1. Terminal 1: Start the FastAPI Backend
Open a terminal in the root folder (`Website`):

**On Windows (PowerShell):**
```powershell
# From project root:
backend\venv\Scripts\python -m uvicorn backend.app.main:app --reload --port 8000
```

**On Linux/macOS:**
```bash
# From project root:
source backend/venv/bin/activate
uvicorn backend.app.main:app --reload --port 8000
```

* API Documentation will be live at: `http://127.0.0.1:8000/api/v1/docs`
* Database will automatically be seeded on first startup.

---

### 2. Terminal 2: Start the Next.js Frontend
Open a second terminal in the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

* Frontend will be live at: `http://localhost:3000` (or `http://127.0.0.1:3000`)

---

## 📦 Containerized Deployment (Docker)

```bash
# Run with docker compose
docker compose up --build -d
```

---

## 📋 Core MVP Pages & Routes

* **Home:** `/` (Value proposition, Category grid, Featured products, Industry regimens, Trust metrics, Lead funnels)
* **Catalog:** `/products` (Interactive search, category pills, live filtering)
* **Product Detail:** `/products/[slug]` (SEO metadata, TDS specifications, usage directions, safety data, quote/sample CTAs)
* **Industries:** `/industries` & `/industries/[slug]` (Sector regimens for Hotels, Restaurants, Schools, Offices, Facility Cleaners)
* **Request a Quote:** `/request-quote` (B2B bulk quotation form with instant tracking reference)
* **Request a Sample:** `/request-sample` (Commercial evaluation kit requests)
* **Become a Distributor:** `/become-distributor` (Dealership and territorial partner applications)
* **About Us:** `/about` (Regional supply hub, quality philosophy)
* **Contact Us:** `/contact` (Direct support desk and inquiry capture)

---

## 🔒 Security & Quality Standards
* Strict Pydantic input validation on all lead endpoints.
* No hardcoded credentials; centralized `.env` configuration.
* Type-safe TypeScript interfaces across all components and API responses.
