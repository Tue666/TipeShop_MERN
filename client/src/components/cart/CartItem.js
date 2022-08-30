import { shape, string, number, bool, array, func } from 'prop-types';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Typography, Checkbox, IconButton } from '@mui/material';
import { Favorite, DeleteForeverOutlined } from '@mui/icons-material';

// component
import ImageLoader from '../../components/ImageLoader';
import Hidden from '../../components/Hidden';
// utils
import { toVND } from '../../utils/formatMoney';
import { distinguishImage } from '../../utils/formatImage';
import enqueueSnackbar from '../../utils/snackbar';
// constant
import { CART_PAGE } from '../../constant';
//
import QuantityInput from './QuantityInput';

const propTypes = {
	item: shape({
		_id: string,
		quantity: number,
		selected: bool,
		product: shape({
			_id: string,
			name: string,
			images: array,
			quantity: number,
			original_price: number,
			price: number,
			limit: number,
			inventory_status: string,
			slug: string,
		}),
	}),
	handleQuantityItemChange: func,
	handleSelectItemChange: func,
	handleRemoveItem: func,
};

const CartItem = ({ item, handleQuantityItemChange, handleSelectItemChange, handleRemoveItem }) => {
	const { _id, quantity, selected, product } = item;
	const { name, images, original_price, price, slug, inventory_status } = product;
	const stock_quantity = {
		max: product.limit,
		min: 1,
		current: product.quantity,
	};
	const linking = `/${slug}/pid${product._id}`;

	const handlePrepareInput = (newQuantity) => {
		const { max, min, current } = stock_quantity;

		// handle remove item if quantity less than min
		if (newQuantity < min) {
			handleRemoveItem(_id);
			return;
		}

		// validate quantity before change
		let prepareChange = {
			hasError: false,
			errorMessage: '',
		};
		if (newQuantity > current) {
			prepareChange.hasError = true;
			prepareChange.errorMessage = `The remaining quantity of the product is ${current}`;
		}
		if (newQuantity > max && max < current) {
			prepareChange.hasError = true;
			prepareChange.errorMessage = `Maximum purchase quantity for this product is ${max}`;
		}
		if (prepareChange.hasError) {
			enqueueSnackbar(prepareChange.errorMessage, {
				anchorOrigin: {
					vertical: 'bottom',
					horizontal: 'center',
				},
				preventDuplicate: true,
			});
			return;
		}

		handleQuantityItemChange(_id, product._id, newQuantity);
	};
	return (
		<RootStyle
			sx={
				(inventory_status !== 'availabel' || product.quantity < 1) && {
					pointerEvents: 'none',
					opacity: '0.5',
				}
			}
		>
			<ItemGroup>
				<Checkbox
					size="small"
					checked={selected}
					checkedIcon={<Favorite />}
					color="error"
					onClick={() => handleSelectItemChange('item', _id)}
				/>
				<Hidden width="mdDown">
					<Link to={linking}>
						<ImageLoader
							alt={name}
							src={distinguishImage(images[0])}
							sx={{
								width: '80px',
								height: '80px',
							}}
						/>
					</Link>
				</Hidden>
				<Link to={linking}>
					<Name>{name}</Name>
				</Link>
			</ItemGroup>
			<div>
				<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
					{toVND(price)}
				</Typography>
				{price !== original_price && (
					<Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
						{toVND(original_price)}
					</Typography>
				)}
			</div>
			<QuantityInput
				input={quantity.toString()}
				remaining={stock_quantity.current}
				handlePrepareInput={handlePrepareInput}
			/>
			<Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold' }}>
				{toVND(parseInt(quantity) * price)}
			</Typography>
			<IconButton color="error" onClick={() => handleRemoveItem(_id)}>
				<DeleteForeverOutlined />
			</IconButton>
		</RootStyle>
	);
};

const RootStyle = styled('div')({
	display: 'grid',
	gridTemplateColumns: CART_PAGE.GRID_TEMPLATE_COLUMNS,
	alignItems: 'center',
});

const ItemGroup = styled('div')(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: '38px 80px 62%',
	columnGap: '5px',
	alignItems: 'center',
	[theme.breakpoints.down('md')]: {
		gridTemplateColumns: '38px 69%',
	},
}));

const Name = styled('span')(({ theme }) => ({
	fontSize: '13px',
	display: '-webkit-box',
	WebkitLineClamp: 2,
	WebkitBoxOrient: 'vertical',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	'&:hover': {
		color: theme.palette.error.main,
	},
}));

CartItem.propTypes = propTypes;

export default CartItem;
