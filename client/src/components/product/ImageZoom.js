import { array } from 'prop-types';
import { useState, Fragment } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import Lightbox from 'react-image-lightbox';

// components
import ImageLoader from '../ImageLoader';
// utils
import { distinguishImage } from '../../utils/formatImage';
// constant
import { PRODUCT_PAGE } from '../../constant';

const propTypes = {
	images: array,
};

const ImageZoom = ({ images }) => {
	const [index, setIndex] = useState(0);
	const [lightboxIndex, setLightboxIndex] = useState(0);
	const [isOpenLightbox, setIsOpenLightbox] = useState(false);
	const shownCount = 4;
	const imageShow = images.slice(0, shownCount + 1); // Get first shownCount images for showing;

	const handleSwitchImage = (i) => {
		if (i === shownCount) {
			setIsOpenLightbox(true);
			return;
		}
		setIndex(i);
	};
	const handleCloseLightbox = () => {
		setLightboxIndex(0);
		setIsOpenLightbox(false);
	};
	return (
		<Fragment>
			<RootStyle>
				<ImageLoader
					src={distinguishImage(imageShow[index])}
					alt={imageShow[index]}
					sx={{
						height: '370px',
						cursor: 'pointer',
						marginBottom: '10px',
					}}
					sxImg={{
						borderRadius: '5px',
					}}
					onClick={() => setIsOpenLightbox(true)}
				/>
				<Stack direction="row" spacing={1}>
					{imageShow.map((image, i) => (
						<MiniImage key={i} className={index === i ? 'active' : ''} onClick={() => handleSwitchImage(i)}>
							<ImageLoader
								src={distinguishImage(image)}
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
			{isOpenLightbox && (
				<Lightbox
					mainSrc={distinguishImage(images[lightboxIndex])}
					nextSrc={distinguishImage(images[(lightboxIndex + 1) % images.length])}
					prevSrc={distinguishImage(images[(lightboxIndex + images.length - 1) % images.length])}
					onCloseRequest={handleCloseLightbox}
					onMovePrevRequest={() => setLightboxIndex((lightboxIndex + images.length - 1) % images.length)}
					onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
					imageCaption={`${lightboxIndex + 1}/${images.length}`}
				/>
			)}
		</Fragment>
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
