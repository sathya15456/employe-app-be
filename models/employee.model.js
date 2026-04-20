const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "your_secret_key";

const users = [
  {
    email: "admin@gmail.com",
    password: bcrypt.hashSync("123456", 8)
  }
];

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).send({ message: "User not found" });
  }

  const isValid = bcrypt.compareSync(password, user.password);

  if (!isValid) {
    return res.status(401).send({ message: "Invalid password" });
  }

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

  res.send({
    token,
    message: "Login successful"
  });
});



function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send("No token");

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send("Unauthorized");

    req.user = decoded;
    next();
  });
}

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});