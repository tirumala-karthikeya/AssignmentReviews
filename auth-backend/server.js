const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/authRoutes');  
const profileRoutes = require('./routes/profileRoutes'); 
const taskRoutes = require('./routes/taskRoutes');  


dotenv.config();

console.log(process.env.JWT_SECRET);

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Database connected'))
  .catch(err => console.log(err));


  app.use(cors({
      origin: 'http://localhost:3000', 
      credentials: true 
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/currentUserRole", (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = decoded.userId; 
    const user = getUserById(userId); 
    res.json({ role: user.role });
  });
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
