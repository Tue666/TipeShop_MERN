require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// middlewares
const errorsHandling = require('./app/middlewares/errorsHandling');
// config
const db = require('./config/db');
const { corsConfig } = require('./config/config');
// routes
const initialRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
	origin: (origin, callback) => {
		if (corsConfig.whiteList.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};
app.use(cors(corsOptions));

app.use('/images', express.static(path.join(__dirname, '../uploads')));

initialRoutes(app);

// handling errors status
app.use(errorsHandling);

app.listen(PORT, () => {
	console.log(`Server is running at PORT ${PORT}`);
});
