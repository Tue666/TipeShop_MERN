import { shape, number, string, array } from 'prop-types';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Stack, Card, CardContent, Typography, Tooltip } from '@mui/material';

// components
import ImageLoader from './ImageLoader';
import Stars from './Stars';
// utils
import { toVND } from '../utils/formatMoney';
// constant
import { CARD_WIDTH } from '../constant';
// utils
import { distinguishImage } from '../utils/formatImage';

const CARD = {
	WIDTH: CARD_WIDTH,
	HEIGHT: 'auto',
};

const propTypes = {
	products: shape({
		_id: string,
		name: string,
		images: array,
		discount: number,
		discount_rate: number,
		original_price: number,
		price: number,
		quantity_sold: shape({
			text: string,
			value: number,
		}),
		rating_average: number,
		slug: string,
	}),
};

const ProductCard = ({ product }) => {
	const {
		_id,
		name,
		images,
		discount,
		discount_rate,
		original_price,
		price,
		quantity_sold,
		rating_average,
		slug,
	} = product;
	return (
		<RootStyle>
			<Link to={`/${slug}/pid${_id}`}>
				<ImageLoader
					src={distinguishImage(images[0])}
					alt={name}
					sx={{
						borderRadius: '5px',
						transition: '0.3s',
						'&:hover': {
							transform: 'scale(1.01)',
						},
					}}
					sxImg={{
						borderRadius: '5px',
					}}
				/>
				<CardContent sx={{ height: '100px' }}>
					{/* Product Name */}
					<Tooltip placement="top" title={name} arrow>
						<Name variant="body2">{name}</Name>
					</Tooltip>
					{/* Product rating & sold */}
					<Stack direction="row" spacing={1} alignItems="center">
						{rating_average > 0 && <Stars total={5} rating={rating_average} sx={{ fontSize: '15px' }} />}
						{quantity_sold.value > 0 && (
							<Tooltip placement="top" title={quantity_sold.value} arrow>
								<Typography variant="caption">{quantity_sold.text}</Typography>
							</Tooltip>
						)}
					</Stack>
					{/* Product Price */}
					<Stack direction="row" spacing={1} alignItems="center">
						<Price tag={discount_rate !== 0 ? 'sale' : 'normal'}>
							{discount_rate === 0 ? toVND(original_price) : toVND(price)}
						</Price>
						{discount_rate !== 0 && (
							<Tooltip placement="top" title={`-${toVND(discount)}`} arrow>
								<SaleTag>-{discount_rate}%</SaleTag>
							</Tooltip>
						)}
					</Stack>
				</CardContent>
			</Link>
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
	boxShadow: 'none',
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

ProductCard.propTypes = propTypes;

export default ProductCard;
