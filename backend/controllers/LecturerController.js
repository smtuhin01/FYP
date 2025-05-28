const Lecturer = require('../models/Lecturer');
const Notification = require('../models/Notification');
const ImageParameter = require('../models/ImageParameter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const lecturer = await Lecturer.create({ name, email, password: hashed });
    res.status(201).json({ message: 'Lecturer registered', lecturer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const lecturer = await Lecturer.findOne({ email });
  if (!lecturer || !(await bcrypt.compare(password, lecturer.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: lecturer._id, role: 'lecturer' }, process.env.JWT_SECRET);
  res.json({ token });
};

const getAllStudents = async (req, res) => {
  const data = await ImageParameter.find().populate('userId');
  const grouped = {};
  data.forEach(record => {
    const key = record.userId._id;
    if (!grouped[key]) {
      grouped[key] = { student: record.userId, images: [] };
    }
    grouped[key].images.push(record);
  });
  res.json(Object.values(grouped));
};

const commentOnStudent = async (req, res) => {
  const { studentId, imageId, comment, mark } = req.body;
  await Notification.create({
    studentId,
    lecturerId: req.user.id,
    imageId,
    comment,
    mark
  });
  res.json({ message: 'Comment and mark sent' });
};

const getNotifications = async (req, res) => {
  const notes = await Notification.find({ studentId: req.user.id }).populate('lecturerId');
  res.json(notes);
};

module.exports = {
  register,
  login,
  getAllStudents,
  commentOnStudent,
  getNotifications
};
