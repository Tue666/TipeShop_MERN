require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// config
const db = require('./config/db');
const corsOptions = require('./config/cors');
const { corsConfig } = require('./config/config');
// handlers
const errorsHandling = require('./handlers/errorsHandler');
const liveChatHandler = require('./handlers/socket/liveChatHandler');
// routes
const initialRoutes = require('./routes');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: corsConfig.whiteList,
	},
});
const PORT = process.env.PORT || 5000;

const onSocketConnection = (socket) => {
	liveChatHandler(io, socket);
};
io.on('connection', onSocketConnection);

db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions));

app.use('/images', express.static(path.join(__dirname, '../uploads')));

initialRoutes(app);

// handling errors status
app.use(errorsHandling);

server.listen(PORT, () => {
	console.log(`Server is running at PORT ${PORT}`);
});
