// backend/src/index.ts
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// DB setup
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Passport config
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: 'http://localhost:3001/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(null, false);

    const user = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      const newUser = await db.query(
        'INSERT INTO usuarios (email, provider) VALUES ($1, $2) RETURNING *',
        [email, 'google']
      );
      return done(null, newUser.rows[0]);
    }
    return done(null, user.rows[0]);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    done(null, user.rows[0]);
  } catch (err) {
    done(err);
  }
});

// Routes
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  try {
    const result = await db.query(
      'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);

app.listen(3000, () => console.log('Server running on port 3000'));

