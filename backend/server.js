const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'data.json');
const SECRET = 'mysecretkey';
const upload = multer({ dest: path.join(__dirname, 'uploads') });

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function validateOrderPayload(req, res, next) {
    const { item, deliveryAddress, quantity, phone } = req.body;
    const errors = [];
    if (!item) errors.push('Item is required');
    if (!deliveryAddress) errors.push('Delivery address is required');
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) errors.push('Quantity must be a positive number');
    if (!/^\d{10,15}$/.test(phone)) errors.push('Phone must be 10-15 digits');

    if (errors.length) return res.status(400).json({ success: false, errors });
    next();
}

app.post('/api/register', express.json(), async (req, res) => {
    const { username, password } = req.body;
    const db = readData();
    if (db.users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, password: hashedPassword, role: 'user' };
    db.users.push(newUser);
    writeData(db);
    res.status(201).json({ message: 'User registered' });
});

app.post('/api/login', express.json(), async (req, res) => {
    const { username, password } = req.body;
    const db = readData();
    const user = db.users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET);
    res.json({ success: true, token });
});

app.get('/api/orders', authenticateToken, (req, res) => {
    const db = readData();
    if (req.user.role === 'admin') {
        res.json(db.orders);
    } else {
        const userOrders = db.orders.filter(o => o.userId === req.user.id);
        res.json(userOrders);
    }
});

app.post('/api/orders', authenticateToken, upload.single('image'), validateOrderPayload, (req, res) => {
    const db = readData();
    const newOrder = {
        id: Date.now(),
        userId: req.user.id,
        item: req.body.item,
        deliveryAddress: req.body.deliveryAddress,
        quantity: Number(req.body.quantity),
        phone: req.body.phone,
        notes: req.body.notes || '',
        agree: req.body.agree === 'true',
        status: 'pending',
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    };
    db.orders.push(newOrder);
    writeData(db);
    res.status(201).json(newOrder);
});

app.put('/api/orders/:id', authenticateToken, upload.single('image'), validateOrderPayload, (req, res) => {
    const db = readData();
    const orderIndex = db.orders.findIndex(o => o.id === Number(req.params.id));
    if (orderIndex === -1) return res.sendStatus(404);

    const order = db.orders[orderIndex];
    if (order.userId !== req.user.id && req.user.role !== 'admin') return res.sendStatus(403);

    const updated = {
        ...order,
        item: req.body.item,
        deliveryAddress: req.body.deliveryAddress,
        quantity: Number(req.body.quantity),
        phone: req.body.phone,
        notes: req.body.notes,
        agree: req.body.agree === 'true',
        imageUrl: req.file ? `/uploads/${req.file.filename}` : order.imageUrl
    };

    db.orders[orderIndex] = updated;
    writeData(db);
    res.json(updated);
});

app.delete('/api/orders/:id', authenticateToken, (req, res) => {
    const db = readData();
    const orderIndex = db.orders.findIndex(o => o.id === Number(req.params.id));
    if (orderIndex === -1) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const order = db.orders[orderIndex];
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Not allowed to delete this order' });
    }

    db.orders.splice(orderIndex, 1);
    writeData(db);
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
