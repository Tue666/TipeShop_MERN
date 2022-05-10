import { array } from 'prop-types';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import ImageLoader from '../ImageLoader';
// config
import { apiConfig } from '../../config';
// constant
import { PRODUCT_PAGE } from '../../constant';

const propTypes = {
	images: array,
};

const ImageZoom = ({ images }) => {
	const [index, setIndex] = useState(0);
	const shownCount = 4;
	const imageShow = images.slice(0, shownCount + 1); // Get first 4 images for showing;

	const handleSwitchImage = (i) => {
		if (i === shownCount) {
			console.log('Show All Images');
			return;
		}
		setIndex(i);
	};
	return (
		<RootStyle>
			<ImageLoader
				src={`${apiConfig.image_url}/${imageShow[index]}`}
				alt={imageShow[index]}
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
				{imageShow.map((image, i) => (
					<MiniImage key={i} className={index === i ? 'active' : ''} onClick={() => handleSwitchImage(i)}>
						<ImageLoader
							src={`${apiConfig.image_url}/${image}`}
							alt={image}
							sx={{
								width: '100%',
								height: '100%',
							}}
							sxImg={{
								borderRadius: '5px',
							}}
						/>
						{i === shownCount && <ViewAllText>View all images</ViewAllText>}
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

ImageZoom.propTypes = propTypes;

export default ImageZoom;
