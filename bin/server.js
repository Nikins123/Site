const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
// const fs = require('fs');

const app = express();
app.use(bodyParser.json());


// Підключення до бази даних
const db = mysql.createConnection({
  host: 'localhost',
  user: 'Юзера',
  password: 'Вводите сюди пароль від бази', 
  database: 'Назву бази'
});
// Підключення до бази даних
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL Database');
});

// Роут для кореневої сторінки
app.use(express.static('public'));

app.get('/', (req, res) => {
  
    
  // res.sendFile(__dirname + 'public/css/styles.css');// Відправляє HTML-файл
  res.sendFile(__dirname + '/public/login.html');
  // res.end();
});
// app.get('/', (req, res) => {
//    // Відправляє HTML-файл
// });

// Роут для авторизації користувача
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Введіть ім\'я користувача і пароль' });
  }

  const sql = `SELECT * FROM users WHERE username = ?`;
  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Помилка сервера' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Невірне ім\'я користувача або пароль' });
    }

    const user = result[0];

    // Перевірка пароля за допомогою bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Помилка сервера' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Невірний пароль' });
      }

      res.json({ message: 'Успішний вхід' });
    });
  });
});

// Роут для реєстрації нового користувача
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Введіть ім\'я користувача і пароль' });
  }

  // Хешування пароля
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Помилка сервера' });
    }

    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.query(sql, [username, hash], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Помилка при створенні користувача' });
      }

      res.json({ message: 'Користувач створений успішно' });
    });
  });
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});