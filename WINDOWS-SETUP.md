# 🪟 Windows Setup Guide — BookBank

## ⚠️ Issues You Hit & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `getaddrinfo ENOENT registry.npmjs.org` | Frontend npm install failed due to network | Run install steps separately (see below) |
| `'concurrently' is not recognized` | Root `npm install` wasn't run first | Run `npm install` in root folder first |
| `brew not recognized` | brew is macOS only | Use MongoDB Windows installer |

---

## ✅ Step 1 — Install MongoDB on Windows

### Option A: MongoDB Community Server (Local)

1. Download from: https://www.mongodb.com/try/download/community
2. Choose **Windows** → **msi** → Download
3. Run installer → Choose **Complete** setup
4. ✅ Check **"Install MongoDB as a Service"** (auto-starts on boot)
5. After install, MongoDB runs automatically as a Windows Service

**Verify MongoDB is running:**
```cmd
mongosh
```
You should see a `>` prompt. Type `exit` to quit.

---

### Option B: MongoDB Atlas (Cloud — No Install Needed) ✅ Recommended

1. Go to: https://cloud.mongodb.com
2. Sign up free → Create a **free M0 cluster**
3. Create a database user (remember username + password)
4. Click **Connect** → **Drivers** → copy the connection string
5. Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/bookbank
```

---

## ✅ Step 2 — Fix Frontend Install (Network Issue)

If `npm install --prefix frontend` fails with `getaddrinfo ENOENT`:

**Try these fixes in order:**

### Fix A — Use a different npm registry
```cmd
cd frontend
npm install --registry https://registry.npmjs.org
cd ..
```

### Fix B — Clear npm cache then retry
```cmd
npm cache clean --force
cd frontend
npm install
cd ..
```

### Fix C — Set npm to use IPv4
```cmd
npm config set prefer-ipv4 true
cd frontend
npm install
cd ..
```

### Fix D — Check your internet/VPN
- Disable VPN if active
- Try a different network (mobile hotspot)
- Check Windows Firewall isn't blocking npm

---

## ✅ Step 3 — Install All Dependencies (Correct Order)

Open **PowerShell** or **Command Prompt** in the `book-bank` folder:

```cmd
# Step 1: Install root (gets concurrently)
npm install

# Step 2: Install backend
npm install --prefix backend

# Step 3: Install frontend (needs internet)
npm install --prefix frontend
```

OR just double-click **`install-all.bat`**

---

## ✅ Step 4 — Seed the Database

```cmd
npm run seed
```

Expected output:
```
✅ Seed data inserted successfully!
📝 Test Credentials:
Librarian: librarian@bookbank.com / password123
Student:   student@bookbank.com / password123
Vendor:    vendor@bookbank.com / password123
```

---

## ✅ Step 5 — Run the Application

Since `concurrently` requires root `npm install` first, you have two options:

### Option A — Two Separate Terminals (Simplest on Windows)

**Terminal 1** (Backend):
```cmd
cd book-bank
start-backend.bat
```
OR:
```cmd
cd book-bank\backend
npm run dev
```

**Terminal 2** (Frontend):
```cmd
cd book-bank
start-frontend.bat
```
OR:
```cmd
cd book-bank\frontend
npm run dev
```

### Option B — Single Terminal (after npm install in root)
```cmd
npm install          ← Run this ONCE in book-bank folder first
npm run dev          ← Then this works
```

---

## ✅ Step 6 — Open the App

```
http://localhost:3000
```

Use the **Quick Demo Login** buttons on the landing page, or:

| Role | Email | Password |
|------|-------|----------|
| Librarian | librarian@bookbank.com | password123 |
| Student | student@bookbank.com | password123 |
| Vendor | vendor@bookbank.com | password123 |

---

## 🐛 Common Windows Issues

**PowerShell Execution Policy Error:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**MongoDB service not starting:**
```cmd
# Open Services (Win+R → services.msc)
# Find "MongoDB" → Right-click → Start
```

**Port 5000 or 3000 already in use:**
```cmd
# Find what's using port 5000
netstat -ano | findstr :5000
# Kill it (replace PID with the number shown)
taskkill /PID <PID> /F
```

**npm not recognized:**
- Download Node.js LTS from https://nodejs.org
- Restart terminal after install

---

## ✅ Everything Working Checklist

- [ ] Node.js installed (`node --version` shows v18+)
- [ ] MongoDB running (local service or Atlas)
- [ ] `npm install` run in root `book-bank` folder
- [ ] `npm install --prefix backend` succeeded
- [ ] `npm install --prefix frontend` succeeded
- [ ] `npm run seed` showed success message
- [ ] Backend terminal shows `🚀 Server running on port 5000`
- [ ] Frontend terminal shows `Local: http://localhost:3000`
- [ ] Browser opens `http://localhost:3000` and shows BookBank landing page
