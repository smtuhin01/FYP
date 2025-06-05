const Media = require('../models/media');
const path = require('path');

exports.uploadMedia = async (req, res) => {
  const { category, title, type } = req.body;
  const filePath = req.file.path;
  const media = await Media.create({ title, category, type, filePath });
  res.json(media);
};

exports.getAllMedia = async (req, res) => {
  const media = await Media.find();
  res.json(media);
};

exports.deleteMedia = async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
