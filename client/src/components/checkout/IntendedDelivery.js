import { arrayOf, shape, string, number, array } from 'prop-types';
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import ImageLoader from '../../components/ImageLoader';
// utils
import { toVND } from '../../utils/formatMoney';
import { distinguishImage } from '../../utils/formatImage';

const propTypes = {
	selectedItems: arrayOf(
		shape({
			_id: string,
			quantity: number,
			product: shape({
				name: string,
				images: array,
				price: number,
			}),
		})
	),
};

const IntendedDelivery = ({ selectedItems }) => {
	return (
		<Wrapper spacing={1}>
			<Typography variant="subtitle2">Intended delivery items</Typography>
			{selectedItems.map((item) => {
				const { _id, quantity, product } = item;
				const { name, images, price } = product;
				return (
					<DeliveryItem key={_id}>
						{/* <ShipFee direction="row" alignItems="center" spacing={1}>
							<Typography variant="caption" sx={{ fontWeight: 'bold' }}>
								Fee:
							</Typography>
							<Typography variant="caption" sx={{ fontWeight: 'bold' }}>
								{toVND(23000)}
							</Typography>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
									{toVND(17000)}
								</Typography>
								<Typography
									variant="caption"
									color="success.main"
									sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
								>
									free
								</Typography>
							</Stack>
						</ShipFee> */}
						<ImageLoader alt={name} src={distinguishImage(images[0])} sx={{ width: '60px', height: '60px' }} />
						<Stack sx={{ flex: 1, ml: '10px' }}>
							<Name variant="body2">{name}</Name>
							<Typography variant="subtitle2">
								{toVND(price)} | x{quantity}
							</Typography>
						</Stack>
					</DeliveryItem>
				);
			})}
		</Wrapper>
	);
};

const Wrapper = styled(Stack)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: '5px',
	padding: '15px',
}));

const DeliveryItem = styled('div')(({ theme }) => ({
	position: 'relative',
	border: `2px solid ${theme.palette.background.default}`,
	borderRadius: '5px',
	padding: '15px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
}));

const Name = styled(Typography)({
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
	WebkitLineClamp: 2,
	overflow: 'hidden',
});

// const ShipFee = styled(Stack)({
// 	position: 'absolute',
// 	top: 0,
// 	right: '10px',
// });

IntendedDelivery.propTypes = propTypes;

export default IntendedDelivery;
