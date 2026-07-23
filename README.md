# 📚 BookBank — Library Management System

A full-stack library management system built with **Node.js + Express + MongoDB** (backend) and **React + Vite + Tailwind CSS** (frontend).

---

## 🗂 Project Structure

```
book-bank/
├── backend/
│   ├── models/
│   │   ├── User.js          # Student / Librarian / Vendor
│   │   ├── Book.js          # Book catalog
│   │   ├── BookOrder.js     # Student orders
│   │   ├── BookIssue.js     # Librarian issues
│   │   ├── BookReturn.js    # Book returns
│   │   └── BookEntry.js     # Catalog entries
│   ├── routes/
│   │   ├── auth.js          # Login / Register / Profile
│   │   ├── books.js         # CRUD for books
│   │   ├── orders.js        # Book order flow
│   │   ├── issues.js        # Book issue flow
│   │   ├── returns.js       # Book return flow
│   │   ├── entries.js       # Catalog entry log
│   │   └── users.js         # User management
│   ├── middleware/
│   │   └── auth.js          # JWT auth + role guard
│   ├── config/
│   │   └── seed.js          # Demo data seeder
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Login + Register modals
│   │   │   ├── Dashboard.jsx     # Role-specific stats
│   │   │   ├── Books.jsx         # Book catalog
│   │   │   ├── Orders.jsx        # Order management
│   │   │   ├── Issues.jsx        # Issue management
│   │   │   ├── Returns.jsx       # Return management
│   │   │   ├── Entries.jsx       # Entry log
│   │   │   ├── Users.jsx         # User management
│   │   │   └── Profile.jsx       # User profile
│   │   ├── components/
│   │   │   └── DashboardLayout.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json             # Root scripts (run both servers)
└── README.md
```

---

## 🛢 Recommended Database: MongoDB

**Why MongoDB?**

| Feature | Benefit for BookBank |
|--------|----------------------|
| Flexible schema | Books, users, and entries have varying fields |
| Document model | Orders/issues embed references naturally |
| Mongoose ODM | Clean models with validations & virtuals |
| Scalable | Handles large library catalogs easily |
| Atlas cloud | Free tier for deployment |

**Alternative:** PostgreSQL with Prisma is fine for relational needs, but MongoDB's flexibility is ideal here.

## 🚀 Setup & Installation

### Step 1 — Clone / Download the project

```bash
# If using Git
git clone <your-repo-url>
cd book-bank

# OR just cd into the project folder
cd book-bank
```

### Step 2 — Install all dependencies

```bash
npm install                  # root (concurrently)
npm install --prefix backend
npm install --prefix frontend
```

Or use the combined script:

```bash
npm run install:all
```

### Step 3 — Configure environment

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookbank
JWT_SECRET=bookbank_super_secret_jwt_key_2024
NODE_ENV=development
```

> If using MongoDB Atlas, replace MONGODB_URI with your connection string:
> `MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/bookbank`

### Step 4 — Start MongoDB (local)

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu / WSL
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Step 5 — Seed demo data

```bash
npm run seed
```

This creates 3 demo users + 8 sample books.

### Step 6 — Run the application

```bash
# Run both backend (port 5000) and frontend (port 3000) together
npm run dev
```

Or run separately:

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
`
