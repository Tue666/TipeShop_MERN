/*
	common event format: handler:from-to(key)
	- handler	: what the socket is processing
	- from		: where [key] is sent
	- to 		: where [key] is received
	- key	: what definition of information is being sent
*/

const administrator = 'Tipe-Administrator';

module.exports = (io, socket) => {
	socket.on('chat:client-server(start-chat)', (name) => {
		const client = {
			room: socket.id,
			name,
			isActive: true,
			messages: [],
			unread: 0,
		};
		io.emit('chat:server-manage(client-joined)', client);

		const welcomeMessage = {
			sender: administrator,
			content: `Hi ${name}, how can we help you?`,
		};
		io.to(client.room).emit('chat:server-client(welcome)', client.room, welcomeMessage);
	});

	socket.on('chat:client-server(message)', (room, message) => {
		io.emit('chat:server-manage(message)', room, message);
	});

	socket.on('chat:manage-server(message)', (room, message) => {
		io.to(room).emit('chat:server-client(message)', message);
	});

	socket.on('chat:manage-server(close-room)', (room) => {
		io.to(room).emit('chat:server-client(close-room)');
	});

	socket.on('disconnect', () => {
		const room = socket.id;
		io.emit('chat:server-manage(client-disconnected)', room);
	});
};
