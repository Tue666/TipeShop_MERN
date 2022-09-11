import { bool, string, func } from 'prop-types';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography, TextField, Button, Alert } from '@mui/material';
import { Close, Send } from '@mui/icons-material';

// hooks
import useSocket from '../../hooks/useSocket';

const chatInputPropTypes = {
	onSendMessage: func,
};

const ChatInput = ({ onSendMessage }) => {
	const [input, setInput] = useState('');

	const handleSubmit = () => {
		if (!input) return;
		onSendMessage(input);
		setInput('');
	};
	const handleChangeInput = (e) => {
		setInput(e.target.value);
	};
	return (
		<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3} p={2}>
			<TextField
				value={input}
				variant="outlined"
				size="small"
				fullWidth
				multiline
				maxRows={3}
				onKeyDown={(e) => {
					if (e.code === 'Enter') {
						e.preventDefault();
						handleSubmit();
					}
				}}
				onChange={handleChangeInput}
				sx={{
					'& .MuiOutlinedInput-root': {
						'&.Mui-focused fieldset': {
							borderColor: 'error.main',
						},
					},
				}}
			/>
			<Send sx={{ color: 'error.main', cursor: 'pointer' }} onClick={handleSubmit} />
		</Stack>
	);
};

ChatInput.propTypes = chatInputPropTypes;

const chatTablePropTypes = {
	room: string,
	onChangeRoom: func,
	name: string,
	onChangeName: func,
	visitedChat: bool,
	onVisitedChat: func,
	onCloseChat: func,
};

const ChatTable = ({
	room,
	onChangeRoom,
	name,
	onChangeName,
	visitedChat,
	onVisitedChat,
	onCloseChat,
}) => {
	const socket = useSocket();
	const [messages, setMessages] = useState([]);
	const [roomClosed, setRoomClosed] = useState(false);
	useEffect(() => {
		socket?.on('chat:server-client(welcome)', (room, message) => {
			onChangeRoom(room);
			setMessages((prev) => [...prev, message]);
		});

		socket?.on('chat:server-client(message)', (message) => {
			setMessages((prev) => [...prev, message]);
		});

		socket?.on('chat:server-client(close-room)', () => {
			setRoomClosed(true);
		});

		return () => {
			socket?.off('chat:server-client(welcome)');
			socket?.off('chat:server-client(message)');
			socket?.off('chat:server-client(close-room)');
		};
		// eslint-disable-next-line
	}, []);

	const handleChangeName = (e) => {
		const value = e.target.value;
		onChangeName(value);
	};
	const handleStartChat = () => {
		onVisitedChat();
		socket?.emit('chat:client-server(start-chat)', name);
	};
	const handleSendMessage = (input) => {
		const message = {
			sender: name,
			content: input,
		};
		socket?.emit('chat:client-server(message)', room, message);
		setMessages([...messages, message]);
	};
	return (
		<RootStyle>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{
					p: 2,
					bgcolor: 'error.main',
					borderRadius: '5px 5px 0 0',
					color: '#fff',
				}}
			>
				<Typography variant="subtitle2">Chat with TipeShop</Typography>
				<Close sx={{ cursor: 'pointer' }} onClick={onCloseChat} />
			</Stack>
			{!visitedChat && (
				<Stack justifyContent="center" alignItems="center" spacing={2} sx={{ height: '100%' }}>
					<Typography variant="subtitle2">What's your name?</Typography>
					<TextField
						autoComplete="none"
						variant="standard"
						size="small"
						color="error"
						placeholder="Enter your name here..."
						onChange={handleChangeName}
					/>
					<Button variant="outlined" color="error" onClick={handleStartChat}>
						Start
					</Button>
				</Stack>
			)}
			{visitedChat && (
				<>
					<Scroll>
						{messages.map((message, index) => {
							const { sender, content } = message;
							return (
								<Message key={index} object={sender === name ? 'sender' : 'other'} variant="subtitle2">
									{content}
								</Message>
							);
						})}
					</Scroll>
					{roomClosed && (
						<Alert severity="error" sx={{ margin: '10px' }}>
							The chat has been closed by Administrator
						</Alert>
					)}
					{!roomClosed && <ChatInput onSendMessage={handleSendMessage} />}
				</>
			)}
		</RootStyle>
	);
};

const RootStyle = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	position: 'absolute',
	right: '70px',
	bottom: 0,
	width: '375px',
	height: '450px',
	borderRadius: '5px',
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[3],
}));

const Scroll = styled(Stack)(({ theme }) => ({
	padding: theme.spacing(1),
	overflow: 'scroll',
	flexGrow: 1,
}));

const Message = styled(Typography)(({ theme, object }) => ({
	padding: '10px',
	margin: '2px 0',
	borderRadius: '15px',
	alignSelf: object === 'sender' ? 'end' : 'start',
	color: object === 'sender' ? '#fff' : theme.palette.text.primary,
	backgroundColor: object === 'sender' ? theme.palette.error.main : theme.palette.background.default,
}));

ChatTable.propTypes = chatTablePropTypes;

export default ChatTable;
