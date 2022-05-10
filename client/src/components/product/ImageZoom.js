import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import ImageLoader from '../ImageLoader';
// constant
import { PRODUCT_PAGE } from '../../constant';

const ImageZoom = () => {
	return (
		<RootStyle>
			<ImageLoader
				src="https://salt.tikicdn.com/cache/400x400/ts/product/58/30/9a/e74d0f77b9b0fd698d08841f58de8223.jpg"
				alt=""
				sx={{
					height: '370px',
					cursor: 'pointer',
					marginBottom: '10px',
				}}
				sxImg={{
					borderRadius: '5px',
				}}
			/>
			<Stack direction="row" spacing={1}>
				{[
					'https://salt.tikicdn.com/cache/400x400/ts/product/58/30/9a/e74d0f77b9b0fd698d08841f58de8223.jpg',
					'https://salt.tikicdn.com/cache/400x400/ts/product/58/30/9a/e74d0f77b9b0fd698d08841f58de8223.jpg',
					'https://salt.tikicdn.com/cache/400x400/ts/product/58/30/9a/e74d0f77b9b0fd698d08841f58de8223.jpg',
					'https://salt.tikicdn.com/cache/400x400/ts/product/58/30/9a/e74d0f77b9b0fd698d08841f58de8223.jpg',
					'https://salt.tikicdn.com/cache/400x400/ts/product/58/30/9a/e74d0f77b9b0fd698d08841f58de8223.jpg',
				].map((image, index) => (
					<MiniImage key={index}>
						<ImageLoader
							src={image}
							alt=""
							sx={{
								width: '100%',
								height: '100%',
							}}
							sxImg={{
								borderRadius: '5px',
							}}
						/>
						{index === 4 && <ViewAllText>View all images</ViewAllText>}
					</MiniImage>
				))}
			</Stack>
		</RootStyle>
	);
};

const RootStyle = styled('div')(({ theme }) => ({
	width: PRODUCT_PAGE.IMAGE_ZOOM_WIDTH,
	padding: '15px',
	borderRight: `2px solid ${theme.palette.background.default}`,
	[theme.breakpoints.down('sm')]: {
		width: '100%',
		borderBottom: `2px solid ${theme.palette.background.default}`,
	},
}));

const MiniImage = styled('div')({
	position: 'relative',
	width: '70px',
	height: '70px',
	backgroundSize: '100% auto',
	borderRadius: '5px',
	cursor: 'pointer',
	'&:not(:last-child):hover': {
		border: '1px solid gray',
	},
	'&:last-child': {
		textAlign: 'center',
	},
	'&.active': {
		border: '1px solid #f53d2d',
	},
});

const ViewAllText = styled(Typography)({
	position: 'absolute',
	width: '100%',
	height: '100%',
	fontSize: '13px',
	fontWeight: 'bold',
	color: 'rgb(255, 255, 255)',
	top: 0,
	backgroundColor: 'rgba(0, 0, 0, 0.7)',
	borderRadius: '5px',
	display: 'flex',
	alignItems: 'center',
	'&:hover': {
		backgroundColor: 'rgba(0, 0, 0, 0.65)',
	},
});

export default ImageZoom;
