const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/connection');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);

/* -------------------- Middleware -------------------- */

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- Routes -------------------- */

// API routes (namespaced)
app.use('/api', routes);

/* -------------------- Serve Client (Production) -------------------- */

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');

  app.use(express.static(distPath));

  // SPA fallback for React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

/* -------------------- Error Handling -------------------- */

// 404s (API only)
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

/* -------------------- Server -------------------- */

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
