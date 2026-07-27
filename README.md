# 🥔 Potato
### A Discord Bot for Book Lovers

A Discord bot for readers and book communities. More than just a search bot—it helps you discover books, track your reading progress, maintain reading streaks, manage your wishlist, explore real quotes, and showcase your public reading profile, all without leaving Discord.

Built with **Node.js**, **discord.js**, and **MongoDB Atlas**.

---

## ✨ Features

### 📚 Discover
- `/book <title>` — search any book, with cover, author, year, pages, genres, and a "Read Free" button when a legal public-domain copy exists
- `/author <name>` — author bio, birth/death, nationality, famous works
- `/similar <title>` — books similar in genre/theme
- `/random [genre]` — a random pick, with an "Another Random Book" button
- `/recommend genre:<genre>` — genre-based recommendations

### 📖 Reading Tracker
- `/start title:<title> pages:<n>` — start tracking a book
- `/progress pages:<n>` — update your current page
- `/current` — see your active book, progress %, and estimated completion
- `/finished` — mark a book complete, move it to your history

### 📝 Wishlist
- `/wishlist add|remove|view` — manage a personal, duplicate-free wishlist

### 🔥 Reading Streak
- `/read` — log today's reading session; tracks current and longest streak

### 💬 Quotes
- `/quote book:<title>` — a real quote sourced from Wikiquote
- `/quote author:<name>` — a real, attributed author quote
- `/quote` — a random quote
- Daily **Quote of the Day**, auto-posted via `/setquotechannel` (admin-only)
- No fabricated quotes — if no legally-sourced quote is available, the bot says so honestly

### 👤 Public Reading Profile
- `/collection [@user]` — view your own or someone else's reading profile: currently reading, completed books, wishlist preview, streaks, total pages read, auto-calculated favorite genre, and reading badges
- `/privacy mode:<public|private>` — control who can see your profile
- Buttons to drill into **Current Book**, **Completed Books**, **Wishlist**, and **Reading Stats**
- Auto-unlocking badges: 🌱 First Book, 📚 Bookworm, 🔥 7-Day Streak, ⚡ 30-Day Streak, 📖 1000 Pages Read

---

## 🛠 Tech Stack

| | |
|---|---|
| Runtime | Node.js |
| Discord | discord.js v14 |
| Database | MongoDB + Mongoose |
| HTTP | Axios |
| Scheduling | node-cron |
| Hosting | Render (free tier) |

## 🌐 External APIs

| API | Used for |
|---|---|
| [Open Library](https://openlibrary.org/developers/api) | Book & author search, covers, genre/subject browsing |
| [Gutendex](https://gutendex.com/) | Legal, public-domain free-reading links (Project Gutenberg) |
| [Wikiquote](https://en.wikiquote.org) | Real, sourced quotes by book or author |
| [ZenQuotes](https://zenquotes.io/) | Random quotes / Quote of the Day |

All quotes are pulled live from these sources — nothing is hardcoded or fabricated. If a legal quote genuinely isn't available, the bot tells you instead of guessing.

---

## 📂 Project Structure

```
src/
├── commands/       # one file per slash command
├── events/         # discord.js lifecycle events
├── buttons/        # button interaction handlers
├── selectMenus/    # select menu interaction handlers
├── services/       # business logic — API calls, DB queries
├── models/         # Mongoose schemas
├── constants/       # badge definitions
├── utils/          # embed builders, logger
├── database/       # MongoDB connection
├── jobs/           # node-cron scheduled tasks
└── keepAlive.js    # lightweight HTTP server for free-tier hosting
```

---

## 🚀 Setup

### Prerequisites
- [Node.js](https://nodejs.org) (v18+)
- A [Discord Application + Bot](https://discord.com/developers/applications)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/potato.git
cd discord-reading-bot
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_client_id
MONGO_URI=your_mongodb_connection_string
```

### Register Commands & Run

```bash
node deploy-commands.js   # registers slash commands globally (run once, or after adding/changing a command)
node index.js             # starts the bot
```

---

## ☁️ Deployment

Deployed on [Render](https://render.com) as a free Web Service, paired with a lightweight keep-alive HTTP endpoint and an [UptimeRobot](https://uptimerobot.com) monitor pinging every 5 minutes to prevent the free tier from sleeping.

**Build Command:** `npm install`
**Start Command:** `node index.js`

---

## 🔮 Future Improvements

- Per-user timezone-aware reading streaks
- Book cover caching to reduce repeated API calls
- Pagination for long completed-books/wishlist lists
- Combined genre + mood recommendations
- Migrate to a dedicated always-on host as usage grows

---

## 📄 License

MIT
