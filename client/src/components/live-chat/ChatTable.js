import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography, TextField } from '@mui/material';
import { Close, Send } from '@mui/icons-material';

// hooks
import useSocket from '../../hooks/useSocket';

const ChatTable = ({ onCloseChat }) => {
	const socket = useSocket();
	const [input, setInput] = useState('');
	const [messages, setMessages] = useState([]);

	const handleSendMessage = () => {
		if (!input) return;
		const message = {
			sender: 'Pihe',
			content: input,
		};
		socket.emit('client-send-message', message);
		setMessages([...messages, message]);
		setInput('');
	};
	const handleChangeInput = (e) => {
		setInput(e.target.value);
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
			<Scroll>
				{messages.map((message, index) => {
					const { sender, content } = message;
					return (
						<Message key={index} object={sender === 'Pihe' ? 'sender' : 'other'} variant="subtitle2">
							{content}
						</Message>
					);
				})}
			</Scroll>
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
							handleSendMessage();
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
				<Send sx={{ color: 'error.main', cursor: 'pointer' }} onClick={handleSendMessage} />
			</Stack>
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

export default ChatTable;
