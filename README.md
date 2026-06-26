# 🌊 InkWave — Premium Anime & Streetwear Design Marketplace

InkWave is a premium, high-fidelity digital marketplace tailored for anime-inspired streetwear vector designs. Built for print-on-demand (POD) brands, Etsy merchant shops, and apparel designers, InkWave offers an interactive catalog of print-ready vector files (PNG, SVG, AI, EPS, PDF) with fully functional creator and administrative ecosystems.
web link:https://ink-wave-anime-designs-hub.vercel.app/

<img width="1266" height="4429" alt="Body" src="https://github.com/user-attachments/assets/1eb084ce-4667-4318-bf6b-8c3424e990f5" />

---

## ✨ Features

### 🛒 High-End Storefront
* **Dynamic Catalog**: Browse professionally designed vector graphics filtered by category (Samurai, Cyberpunk, Jujutsu Kaisen, etc.) or tags.
* **Interactive Design Previews**: Dynamic preview overlays, detail inspect modals, and full-resolution file specification lists.
* **Wishlist Drawer**: Save favorite designs to a persistent local storage wishlist.
* **Checkout Flow**: Fully modeled checkout dialog with automatic download links.

### 🎨 Creator Console
* **Direct Upload Pipeline**: Creators can upload, title, tag, categorize, and price their vector graphic packages.
* **Format Selection**: Specify available formats (PNG, SVG, AI, EPS) and included source resolutions.
* **Payouts & Affiliate Panel**: Track sales earnings, process PayPal/Stripe Connect payout methods, and obtain promotional affiliate referral codes.

### 🛡️ Administrative Dashboard
* **Advanced Analytics**: Real-time monitoring of total downloads, commission revenue, active products, and creator growth.
* **Designs Catalog Controls**: Edit live design metadata, Delist/Archive files, or directly publish Admin Curated designs.
* **Users & Creators Controls**: Promote standard buyers to Creator status, verify designers with official checkmark badges, or suspend accounts.
* **Trace & Rasterization Audits**: Admin approval queue to verify path resolution and DPI accuracy before publishing user designs to the live catalog.
* **Platform Configuration Settings**: Toggle maintenance modes, disable registrations, set commission rates, customize storefront banner headlines, and enable/disable instant free downloads.

### 🔑 Robust Firebase Infrastructure
* **Firestore Native Database**: Structured around `products`, `creators`, `users`, `settings`, and `affiliate_applications` collections.
* **Authentication Security**: Native Firebase Auth supporting **Email/Password** registration and **Google Sign-In**.
* **Database-Driven Configurations**: Storefront settings and banner copy load dynamically from Firestore settings.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 19 (TypeScript)
* **Build System**: Vite 6
* **Styling**: Vanilla CSS (Modern CSS variables, HSL grids, responsive flex layouts)
* **Animation**: Motion (framer-motion)
* **Icons**: Lucide React
* **Backend Database & Auth**: Firebase / Cloud Firestore (v10+ Web SDK)

---

## 🚀 Local Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A [Firebase Project](https://console.firebase.google.com/) configured with Firestore and Authentication.

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory and populate it with your Firebase config values:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=1:your_app_id:web:your_web_app_id
VITE_FIREBASE_DATABASE_ID=(default)
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Admin Portal Credentials

The admin dashboard is hidden from the main site navigation for security.
* **URL Location**: Access by navigating directly to `http://localhost:3000/admin`
* **Local Developer Bypass Login**:
  * **Username**: `username`
  * **Passkey**: `password`

---

## 📂 Project Structure

```text
├── .agents/                    # Developer assistant custom rules and skills
├── dist/                       # Output production build folder
├── src/
│   ├── components/             # Reusable UI Components
│   │   ├── AdminDashboard.tsx  # Fully featured admin suite
│   │   ├── Dashboard.tsx       # Creator console portfolio uploader
│   │   ├── DesignRenderer.tsx  # Dynamic vector canvas visualizer
│   │   └── ...
│   ├── lib/
│   │   └── firebase.ts         # Firebase SDK initialization and helper methods
│   ├── types.ts                # TypeScript interface definitions
│   ├── App.tsx                 # Core App layout and state coordination
│   ├── index.css               # Design tokens, fonts, and dark theme variables
│   └── main.tsx                # React DOM render entry
├── firebase.json               # Firebase CLI tool configurations
├── firestore.rules             # Database read/write security rules
└── package.json                # Project configurations & dependency versions
```
