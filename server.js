const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Employee = require('./models/Employee');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "your_secret_key";

mongoose.connect('mongodb://127.0.0.1:27017/employeeDB')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const users = [
  {
    email: "admin@gmail.com",
    password: bcrypt.hashSync("123456", 8)
  }
];

app.post('/login', (req, res) => {
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

  res.send({ token, message: "Login successful" });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).send("No token");
  }

  const token = authHeader.replace('Bearer ', '');

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send("Unauthorized");

    req.user = decoded;
    next();
  });
}

app.get('/employees', verifyToken, async (req, res) => {
  try {
    let { page = 1, limit = 5, search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ]
    };

    const total = await Employee.countDocuments(query);

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const employees = await Employee.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    res.send({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: employees
    });

  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/employees/:id', verifyToken, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.send(employee);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.post('/employees', verifyToken, async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();

  res.send(emp);
});


app.put('/employees/:id', verifyToken, async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.send(updated);
});


app.delete('/employees/:id', verifyToken, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted successfully" });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});