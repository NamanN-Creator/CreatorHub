# CreatorHub — MERN Stack Project

A simple full-stack version of the CreatorHub UI design: one real app,
backed by a real database, covering all 4 stakeholders from the practical.

## What "MERN" means here (for explaining to Swapnil)

| Letter | What it is in this project | Folder |
|---|---|---|
| **M** — MongoDB | The database. Stores Users, Campaigns, Proposals, Tasks, Invoices. | (runs separately, e.g. `mongod` or MongoDB Atlas) |
| **E** — Express | The web server / REST API. Defines routes like `POST /api/campaigns`. | `backend/` |
| **R** — React | The frontend UI the user actually sees and clicks on. | `frontend/` |
| **N** — Node.js | The JavaScript runtime that runs the Express server. | `backend/` |

**The flow:** React (browser) → sends an HTTP request → Express (server) →
reads/writes → MongoDB (database) → sends data back → React displays it.

## One role field = four stakeholders

Instead of building 4 separate apps, there is **one** `User` model with a
single `role` field: `creator`, `brand`, `talent`, or `finance`. Every page
and every API route checks `req.user.role` to decide what to show / allow.
That's the whole trick — same database, same code, different experience
per login. This is the simplest, most "explainable in 2 minutes" way to
do multi-stakeholder access control.

## How each stakeholder maps to the practical's requirement

| Stakeholder | What they can do | Routes / pages |
|---|---|---|
| **Creator** | Discover published campaigns, send proposals, see their tasks, see their invoices | `/campaigns`, `/campaigns/:id`, `/proposals`, `/tasks`, `/invoices` |
| **Brand Representative** | Create & publish campaigns, accept/reject proposals | `/campaigns` (create form), `/proposals` (accept/reject) |
| **Talent Manager** | Assign tasks to creators, track task status | `/tasks` (assign form + status dropdown) |
| **Finance Manager** | Generate invoices, update payment status | `/invoices` (generate form + status dropdown) |

## Project structure

```
creatorhub-mern/
├── backend/
│   ├── config/db.js          # connects to MongoDB
│   ├── middleware/auth.js    # checks the login token on protected routes
│   ├── models/               # Mongoose schemas (User, Campaign, Proposal, Task, Invoice)
│   ├── routes/                # Express routes (one file per resource)
│   ├── server.js             # entry point — wires everything together
│   └── package.json
└── frontend/
    ├── public/index.html
    └── src/
        ├── pages/             # one file per screen (Login, Dashboard, Campaigns, ...)
        ├── context/AuthContext.js  # keeps track of who's logged in
        ├── api.js             # talks to the backend
        ├── App.js             # routing
        └── index.css          # same colors/styles as the Figma mockups
```

## How to run it

**1. Start MongoDB** (locally, or use a free MongoDB Atlas cluster and
paste its connection string into `.env`).

**2. Backend:**
```bash
cd backend
cp .env.example .env     # then edit MONGO_URI / JWT_SECRET if needed
npm install
npm run dev               # starts on http://localhost:5000
```

**3. Frontend** (in a second terminal):
```bash
cd frontend
npm install
npm start                 # opens http://localhost:3000
```

**4. Load demo data (optional but recommended for a demo):**
```bash
cd backend
npm run seed
```
This wipes and repopulates the database with 6 users (3 creators, 1 brand,
1 talent manager, 1 finance manager), 3 campaigns, 4 proposals, 4 tasks and
3 invoices — already spread across every status (pending/accepted,
in-progress/completed, paid/pending, etc.) so every screen has something
to show immediately. It prints the login list when it finishes. You can
re-run it any time to reset back to this state.

**Demo logins** (password for all of them: `password123`):

| Role | Email |
|---|---|
| Creator | `sarah@creator.com` |
| Creator | `dev@creator.com` |
| Creator | `anaya@creator.com` |
| Brand | `riya@brand.com` |
| Talent Manager | `aman@talent.com` |
| Finance Manager | `meera@finance.com` |

**5. Or try it from scratch instead:**
- Register 4 accounts, one per role (creator / brand / talent / finance).
- Log in as **brand** → create a campaign → publish it.
- Log in as **creator** → discover it → send a proposal.
- Log in as **brand** → accept the proposal.
- Log in as **talent** → assign a task to that creator.
- Log in as **finance** → generate an invoice for that creator, mark it Paid.

Either path — seeded or from scratch — is the full end-to-end demo for
the practical.

## What's deliberately kept simple

- No file/image uploads — content submission is represented by text
  fields only, to keep the data model small.
- No email verification — registration logs you straight in.
- Talent Manager / Finance Manager can see **every** campaign and creator
  (not scoped to "their" team), since the practical doesn't require
  multi-tenant isolation between staff.
- Styling is plain CSS (same color tokens as the Figma mockups: dark ink
  `#13231f`, teal `#1f6b52`) — no UI framework, so it's easy to read and
  explain line by line.
