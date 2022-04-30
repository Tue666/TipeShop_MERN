const path = require('path');
const multer = require('multer');

const storage = {
	filename: (req, file, cb) => {
		// will insert even if file existed
		// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		// cb(null, uniqueSuffix + '-' + file.originalname)

		// will not insert if file existed
		cb(null, file.originalname);
	},
};

const fileFilter = (req, file, cb) => {
	const extension = path.extname(file.originalname).toLowerCase();
	const allows = ['.jpg', '.png', '.jpeg', '.gif'];
	if (allows.includes(extension)) {
		cb(null, true);
	} else {
		cb(new Error('Only images allowed'), false);
	}
};

module.exports = (isFileSaved) => {
	isFileSaved &&
		(storage.destination = (req, file, cb) => {
			cb(null, 'uploads');
		});
	return multer({
		storage: multer.diskStorage(storage),
		limits: {
			fileSize: 1024 * 1024 * 4, // maximum is 4MB per image
		},
		fileFilter: fileFilter,
	});
};
