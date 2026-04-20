const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let db;

function connectWithRetry() {
  db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestion_leads'
  });

  db.connect((err) => {
    if (err) {
      console.error('MySQL connection failed, retrying in 5s...', err.message);
      db.destroy();
      setTimeout(connectWithRetry, 5000);
      return;
    }
    console.log('Connected to MySQL');

    db.on('error', (err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        connectWithRetry();
      } else {
        throw err;
      }
    });
  });
}

connectWithRetry();

app.get('/', (req, res) => {
  res.json({ message: 'Gestion des leads API' });
});

app.get('/leads', (req, res) => {
  db.query('SELECT * FROM leads ORDER BY created_at DESC', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(data);
  });
});

app.post('/leads', (req, res) => {
  const { nom, statut, tel, adresse, commentaire } = req.body;
  db.query(
    'INSERT INTO leads (nom, statut, tel, adresse, commentaire) VALUES (?, ?, ?, ?, ?)',
    [nom, statut || 'nouveau', tel, adresse, commentaire],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nom, statut, tel, adresse, commentaire });
    }
  );
});

app.put('/leads/:id', (req, res) => {
  const { nom, statut, tel, adresse, commentaire } = req.body;
  db.query(
    'UPDATE leads SET nom=?, statut=?, tel=?, adresse=?, commentaire=? WHERE id=?',
    [nom, statut, tel, adresse, commentaire, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: Number(req.params.id), nom, statut, tel, adresse, commentaire });
    }
  );
});

app.delete('/leads/:id', (req, res) => {
  db.query('DELETE FROM leads WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lead supprimé' });
  });
});

app.listen(8081, () => {
  console.log('Server running on port 8081');
});
