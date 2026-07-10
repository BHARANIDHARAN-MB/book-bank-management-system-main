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

---

## ⚙️ Prerequisites

Make sure these are installed:

- **Node.js** v18+ → https://nodejs.org
- **MongoDB** v6+ (local) → https://www.mongodb.com/try/download/community
  - OR use **MongoDB Atlas** (cloud, free tier): https://cloud.mongodb.com
- **npm** v9+

---

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
```

### Step 7 — Open in browser

```
http://localhost:3000
```

---

## 🔑 Demo Login Credentials

| Role       | Email                      | Password     |
|------------|----------------------------|--------------|
| Librarian  | librarian@bookbank.com     | password123  |
| Student    | student@bookbank.com       | password123  |
| Vendor     | vendor@bookbank.com        | password123  |

> Use the **Quick Demo Login** buttons on the landing page to auto-fill.

---

## 🧪 Testing the App — Full Walkthrough

### ✅ Test 1: Authentication

1. Go to `http://localhost:3000`
2. Click **Register** → create a new student account (fill name, email, password, phone)
3. Logout → click **Sign In** → login with the same credentials
4. Try the demo login buttons for each role

---

### ✅ Test 2: Vendor — Add a Book

1. Login as **Vendor** (`vendor@bookbank.com`)
2. Go to **Books** → click **Add Book**
3. Fill in: Title, Author, Category, Total Copies, Price
4. Click **Add Book** → book appears in catalog

---

### ✅ Test 3: Student — Order a Book

1. Login as **Student** (`student@bookbank.com`)
2. Go to **Books** → browse the catalog
3. Go to **Book Orders** → click **New Order**
4. Select a book, set Required By date, choose Purpose
5. Click **Place Order** → status shows **pending**

---

### ✅ Test 4: Librarian — Approve Order & Issue Book

1. Login as **Librarian** (`librarian@bookbank.com`)
2. Go to **Book Orders** → see the pending order
3. Click **Approve** → status changes to **approved**
4. Go to **Book Issues** → click **Issue Book**
5. Select the student and book, set a Due Date
6. Click **Issue Book** → available copies decrease by 1

---

### ✅ Test 5: Student — Return a Book

1. Login as **Student**
2. Go to **Book Returns** → click **Return Book**
3. Select the issued book from the dropdown
4. Choose condition (good/fair/etc.) → click **Process Return**
5. If overdue, a fine (₹2/day) is shown and collected

---

### ✅ Test 6: Librarian — Book Entry Log

1. Login as **Librarian**
2. Go to **Book Entries** → click **New Entry**
3. Select a book, choose entry type (restock, withdrawal, etc.)
4. Set quantity added/removed → click **Record Entry**
5. Book copy count updates automatically

---

### ✅ Test 7: Librarian — User Management

1. Login as **Librarian**
2. Go to **Users** → filter by student/librarian/vendor
3. Click **Deactivate** on a user → they can no longer login
4. Click **Activate** to restore access

---

### ✅ Test 8: Overdue Fine Calculation

1. Login as **Librarian** → Issue a book with **past due date** (manually set in DB or wait)
2. Go to **Book Issues** → status auto-updates to **overdue**
3. Fine = ₹2 × days overdue shown in the issues table
4. When returned, fine is collected and shown in returns

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Books
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/books` | All roles |
| POST | `/api/books` | Vendor / Librarian |
| PUT | `/api/books/:id` | Vendor / Librarian |
| DELETE | `/api/books/:id` | Librarian |

### Orders
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/orders` | Student (own) / Librarian (all) |
| POST | `/api/orders` | Student |
| PUT | `/api/orders/:id/status` | Librarian |
| PUT | `/api/orders/:id/cancel` | Student |

### Issues
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/issues` | Student (own) / Librarian (all) |
| POST | `/api/issues` | Librarian |

### Returns
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/returns` | Student (own) / Librarian (all) |
| POST | `/api/returns` | Student / Librarian |

### Entries
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/entries` | Librarian / Vendor |
| POST | `/api/entries` | Librarian |

### Users
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/users` | Librarian |
| PUT | `/api/users/:id/toggle` | Librarian |

---

## 🧩 Role Permissions Matrix

| Feature | Student | Librarian | Vendor |
|---------|---------|-----------|--------|
| View Books | ✅ | ✅ | ✅ |
| Add Book | ❌ | ✅ | ✅ |
| Edit Book | ❌ | ✅ | ✅ |
| Delete Book | ❌ | ✅ | ❌ |
| Place Order | ✅ | ❌ | ❌ |
| View Orders | Own | All | ❌ |
| Approve Order | ❌ | ✅ | ❌ |
| Issue Book | ❌ | ✅ | ❌ |
| Return Book | ✅ | ✅ | ❌ |
| Book Entries | ❌ | ✅ | View |
| Manage Users | ❌ | ✅ | ❌ |
| View Dashboard | ✅ | ✅ | ✅ |

---

## 🐛 Troubleshooting

**MongoDB not connecting?**
```bash
# Check if mongod is running
mongosh
# If fails, start it:
sudo systemctl start mongod   # Linux
brew services start mongodb-community  # macOS
```

**Port already in use?**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

**Seed fails with duplicate key error?**
```bash
# Drop the database and re-seed
mongosh bookbank --eval "db.dropDatabase()"
npm run seed
```

**Frontend shows blank / 401 errors?**
- Clear localStorage in browser DevTools → Application → Local Storage
- Re-login with demo credentials

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| HTTP | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| Dates | date-fns |

---

## 📦 Deployment (optional)

**Backend → Railway / Render:**
1. Set `MONGODB_URI` to Atlas connection string
2. Set `JWT_SECRET` to a strong random string
3. Deploy the `/backend` folder

**Frontend → Vercel / Netlify:**
1. Update `vite.config.js` proxy to your deployed backend URL
2. Or set `VITE_API_URL` env var and update `api.js`
3. Run `npm run build --prefix frontend` → deploy `dist/`

---

*Built with ❤️ for educational library management*
