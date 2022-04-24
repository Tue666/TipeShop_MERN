import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack, Card, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import { AddShoppingCart, FindInPage } from '@mui/icons-material';

// components
import ImageLoader from './ImageLoader';
import Stars from './Stars';
// utils
import { toVND } from '../utils/formatMoney';
// constant
import { CARD_WIDTH } from '../constant';

const CARD = {
	WIDTH: CARD_WIDTH,
	HEIGHT: 'auto',
};

const ProductCard = () => {
	return (
		<RootStyle>
			<Link to="/">
				<ImageLoader
					src="https://salt.tikicdn.com/cache/400x400/ts/product/a8/95/83/f78f7caa2f3c0b1032c04470e35be2c2.jpg"
					alt="Image..."
					sx={{
						borderRadius: '5px',
						transition: '0.3s',
						'&:hover': {
							transform: 'scale(1.1)',
						},
					}}
					sxImg={{
						borderRadius: '5px',
					}}
				/>
				<CardContent sx={{ height: '100px' }}>
					{/* Product Name */}
					<Name variant="body2" title="Điện Thoại iPhone 13 128GB - Hàng Chính Hãng Hàng Chính Hãng">
						Điện Thoại iPhone 13 128GB - Hàng Chính Hãng Hàng Chính Hãng
					</Name>
					{/* Product rating & sold */}
					<Stack direction="row" spacing={1} alignItems="center">
						<Stars total={5} rating={4.6} sx={{ fontSize: '15px' }} />
						<Typography variant="caption">1000+ Sold</Typography>
					</Stack>
					{/* Product Price */}
					<Stack direction="row" spacing={1} alignItems="center">
						<Price tag="sale">{toVND(20450000)}</Price>
						<SaleTag>-10%</SaleTag>
					</Stack>
				</CardContent>
			</Link>
			<CardActions>
				<IconButton>
					<AddShoppingCart />
				</IconButton>
				<Link to="/">
					<IconButton>
						<FindInPage />
					</IconButton>
				</Link>
			</CardActions>
		</RootStyle>
	);
};

const RootStyle = styled(Card)(({ theme }) => ({
	width: CARD.WIDTH,
	position: 'relative',
	borderRadius: '5px',
	margin: '1px',
	padding: '10px',
	backgroundImage: 'none',
	boxShadow: '3px 2px 5px rgba(180,180,180,0.1)',
	'&:hover': {
		boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 20px',
		zIndex: 1,
	},
	'& .MuiCardContent-root': {
		padding: '2px 8px',
	},
	'& .MuiCardActions-root': {
		padding: 0,
	},
	[theme.breakpoints.down('sm')]: {
		width: '180px',
		margin: '2px',
	},
}));

const Name = styled(Typography)({
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
	WebkitLineClamp: 2,
	overflow: 'hidden',
	'&:hover': {
		color: 'red',
	},
});

const SaleTag = styled('div')({
	padding: '0px 2px',
	fontSize: '12px',
	fontWeight: '400',
	border: '1px solid rgb(255, 66, 78)',
	borderRadius: '2px',
	backgroundColor: 'rgb(255, 240, 241)',
	color: 'rgb(255, 66, 78)',
});

const Price = styled(Typography)(({ tag, theme }) => ({
	fontWeight: 'bold',
	fontSize: '16px',
	color: tag === 'sale' ? 'red' : theme.palette.text.primary,
}));

export default ProductCard;
