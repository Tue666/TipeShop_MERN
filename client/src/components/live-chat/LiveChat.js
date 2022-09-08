import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { SpeedDial } from '@mui/material';
import { HeadsetMicOutlined, Close } from '@mui/icons-material';

//
import ChatTable from './ChatTable';

const LiveChat = () => {
	const [visibleChat, setVisibleChat] = useState(false);

	const handleVisibleChat = () => {
		setVisibleChat(!visibleChat);
	};
	return (
		<RootStyle>
			{visibleChat && <ChatTable onCloseChat={handleVisibleChat} />}
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
