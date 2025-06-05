const Student = require('../models/User');
const Lecturer = require('../models/Lecturer');

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const User = role === 'student' ? Student : Lecturer;
  const user = await User.create({ name, email, password, role });
  res.json(user);
};

exports.getUsers = async (req, res) => {
  const students = await Student.find();
  const lecturers = await Lecturer.find();
  res.json({ students, lecturers });
};

exports.updateUser = async (req, res) => {
  const { id, role } = req.params;
  const User = role === 'student' ? Student : Lecturer;
  const updated = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

exports.deleteUser = async (req, res) => {
  const { id, role } = req.params;
  const User = role === 'student' ? Student : Lecturer;
  await User.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
};