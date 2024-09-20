app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Введіть ім\'я користувача і пароль' });
    }
  
    // Хешування пароля за допомогою bcrypt
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
  