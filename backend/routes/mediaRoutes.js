const router = require('express').Router();
const multer = require('multer');
const { uploadMedia, getAllMedia, deleteMedia } = require('../controllers/mediaController');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), uploadMedia);
router.get('/', getAllMedia);
router.delete('/:id', deleteMedia);
module.exports = router;
