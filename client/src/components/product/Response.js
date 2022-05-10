import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import Hidden from '../Hidden';
import Avatar from '../Avatar';

const Response = () => (
	<Stack direction="row">
		<Hidden width="mdDown">
			<Avatar
				name="Lê Chính Tuệ"
				src="http://dotshop69.000webhostapp.com/Public/images/tue.png"
				sx={{ width: '50px', height: '50px' }}
			/>
		</Hidden>
		<Message>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Hidden width="mdUp">
					<Avatar
						name="Lê Chính Tuệ"
						src="http://dotshop69.000webhostapp.com/Public/images/tue.png"
						sx={{ width: '20px', height: '20px' }}
					/>
				</Hidden>
				<Typography variant="subtitle2">Lê Chính Tuệ</Typography>
				<Typography variant="caption">12 tháng 03 năm 2021</Typography>
			</Stack>
			<Typography variant="subtitle1">
				Bạn ơi, cho mình hỏi lúc vẽ màn hình của bản vẽ có hiện hình không ạ? Hay chỉ có màn hình laptop
				hiện hình ảnh thôi?
			</Typography>
		</Message>
	</Stack>
);

const Message = styled(Stack)(({ theme }) => ({
	width: 'calc(100% - 50px)',
	padding: '10px',
	marginLeft: '10px',
	backgroundColor: theme.palette.background.default,
	borderRadius: '10px',
	[theme.breakpoints.down('md')]: {
		width: '100%',
		margin: 0,
	},
}));

export default Response;
