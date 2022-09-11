import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { SpeedDial } from '@mui/material';
import { HeadsetMicOutlined, Close } from '@mui/icons-material';

//
import ChatTable from './ChatTable';

const LiveChat = () => {
	const [room, setRoom] = useState('');
	const [name, setName] = useState('');
	const [visitedChat, setVisitedChat] = useState(false);
	const [visibleChat, setVisibleChat] = useState(false);

	const handleChangeRoom = (value) => {
		setRoom(value);
	};
	const handleChangeName = (value) => {
		setName(value);
	};
	const handleVisitedChat = () => {
		setVisitedChat(true);
	};
	const handleVisibleChat = () => {
		setVisibleChat(!visibleChat);
	};
	return (
		<RootStyle>
			{visibleChat && (
				<ChatTable
					room={room}
					onChangeRoom={handleChangeRoom}
					name={name}
					onChangeName={handleChangeName}
					visitedChat={visitedChat}
					onVisitedChat={handleVisitedChat}
					onCloseChat={handleVisibleChat}
				/>
			)}
			<SpeedDial
				ariaLabel="SpeedDial openIcon"
				icon={visibleChat ? <Close /> : <HeadsetMicOutlined />}
				FabProps={{
					sx: {
						color: (theme) => theme.palette.text.primary,
						bgcolor: (theme) => theme.palette.background.paper,
						'&:hover': {
							bgcolor: (theme) => theme.palette.background.default,
						},
					},
				}}
				onClick={handleVisibleChat}
			/>
		</RootStyle>
	);
};

const RootStyle = styled('div')({
	position: 'fixed',
	right: '20px',
	bottom: '20px',
	zIndex: 999,
});

export default LiveChat;
