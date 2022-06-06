import { string, number, shape, oneOfType, array, arrayOf } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-scroll';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Chip, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

// components
import Stars from '../Stars';
import QuantityInput from './QuantityInput';
// redux
import { addCart } from '../../redux/slices/cart';
// utils
import { toVND } from '../../utils/formatMoney';
// config
import { apiConfig } from '../../config';
// constant
import { PRODUCT_PAGE, HEADER_HEIGHT } from '../../constant';

const BODY_INTEND = {
	LEFT_WIDTH: '260px',
};

const propTypes = {
	information: shape({
		_id: string,
		name: string,
		quantity: number,
		rating_average: number,
		review_count: number,
		quantity_sold: shape({
			text: string,
			value: number,
		}),
		discount_rate: number,
		original_price: number,
		price: number,
		attribute_values: oneOfType([
			array,
			arrayOf(
				shape({
					_id: string,
					attribute_query_name: string,
					display_value: string,
					query_value: string,
				})
			),
		]),
		warranty_infor: oneOfType([
			array,
			arrayOf(
				shape({
					name: string,
					value: string,
				})
			),
		]),
		inventory_status: string,
	}),
};

const Information = ({ information }) => {
	const {
		_id,
		name,
		quantity,
		rating_average,
		review_count,
		quantity_sold,
		discount_rate,
		original_price,
		price,
		attribute_values,
		warranty_infor,
		inventory_status,
	} = information;
	const { addresses } = useSelector((state) => state.account);
	const address = addresses.length > 0 ? addresses.filter((address) => address.is_default)[0] : null;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleAddToCart = (input) => {
		dispatch(
			addCart({
				product_id: _id,
				quantity: input,
			})
		);
	};
	const handleTagNavigate = (key, value) => {
		const pathname = '/search';
		navigate({
			pathname,
			search: `?${key}=${value}`,
		});
	};
	return (
		<RootStyle>
			<Typography variant="h6">{name}</Typography>
			<Stack spacing={1}>
				<Stack direction="row" alignItems="center" spacing={1}>
					{rating_average > 0 && <Stars total={5} rating={rating_average} sx={{ fontSize: '18px' }} />}
					{review_count > 0 && (
						<Link to="review" duration={500} offset={parseInt(HEADER_HEIGHT.slice(0, -2)) * -1}>
							<Typography variant="subtitle1" sx={{ fontSize: '14px', cursor: 'pointer' }}>
								(View {review_count} reviews)
							</Typography>
						</Link>
					)}
					{quantity_sold.value > 0 && (rating_average > 0 || review_count > 0) && <DivideLine />}
					{quantity_sold.value > 0 && (
						<Tooltip placement="right" title={quantity_sold.value} arrow>
							<Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
								{quantity_sold.text}
							</Typography>
						</Tooltip>
					)}
				</Stack>
				<Stack direction="row" spacing={1}>
					<Stack spacing={1} sx={{ flex: '1 1 0%' }}>
						<PriceWrapper tag={discount_rate !== 0 ? 'sale' : 'normal'}>
							<Typography variant="h4" sx={{ fontWeight: 'bold' }}>
								{discount_rate === 0 ? toVND(original_price) : toVND(price)}
							</Typography>
							{discount_rate !== 0 && (
								<Typography component="span">
									<Typography
										component="span"
										variant="subtitle1"
										sx={{ color: '#efefef', fontSize: '15px', textDecoration: 'line-through', mx: '5px' }}
									>
										{toVND(original_price)}
									</Typography>
									-{discount_rate}%
								</Typography>
							)}
						</PriceWrapper>
						<Stack sx={{ cursor: 'pointer' }}>
							<Typography variant="subtitle2">Delivery</Typography>
							{address && (
								<Typography variant="subtitle2" sx={{ textDecoration: 'underline' }}>
									{`${address.street}, ${address.ward.name}, ${address.district.name}, ${address.region.name}`}
								</Typography>
							)}
							<Typography variant="subtitle2" sx={{ color: 'rgb(26 139 237)' }}>
								{address ? 'Change' : 'Add new delivery address'}
							</Typography>
						</Stack>
						{quantity > 0 && inventory_status === 'availabel' ? (
							<QuantityInput handleAddToCart={handleAddToCart} />
						) : (
							<Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold' }}>
								The product is out of stock or does not exist anymore.
								<br />
								Come back later, thanks for your attention!
							</Typography>
						)}
					</Stack>
					<IntendWrapper>
						{attribute_values && attribute_values.length > 0 && (
							<Wrapper>
								<Typography variant="caption">Tags:</Typography>
								<Stack direction="row" sx={{ flexWrap: 'wrap' }}>
									{attribute_values.map((value) => {
										const { _id, attribute_query_name, display_value, query_value } = value;
										return (
											<Chip
												key={_id}
												label={display_value}
												variant="contained"
												color="error"
												size="small"
												sx={{ m: '3px' }}
												onClick={() => handleTagNavigate(attribute_query_name, query_value)}
											/>
										);
									})}
								</Stack>
							</Wrapper>
						)}
						{warranty_infor && warranty_infor.length > 0 && (
							<Wrapper>
								{warranty_infor.map((warranty, index) => {
									const { name, value } = warranty;
									return (
										<Stack direction="row" justifyContent="space-between" mb={1} key={index}>
											<Typography variant="caption">{name}</Typography>
											<Typography variant="subtitle2">{value}</Typography>
										</Stack>
									);
								})}
							</Wrapper>
						)}
						<Wrapper sx={{ display: 'flex' }}>
							<Stack direction="column" alignItems="center" spacing={1} mx={1}>
								<img
									src={`${apiConfig.image_url}/_external_/icons/defense_check.png`}
									alt="Refund"
									style={{ width: '32px', height: '32px' }}
								/>
								<Typography sx={{ textAlign: 'center', fontSize: '13px' }}>
									Hoàn tiền <br /> <strong>111%</strong> <br /> nếu hàng giả
								</Typography>
							</Stack>
							<Stack direction="column" alignItems="center" spacing={1} mx={1}>
								<img
									src={`${apiConfig.image_url}/_external_/icons/like.png`}
									alt="Check"
									style={{ width: '32px', height: '32px' }}
								/>
								<Typography sx={{ textAlign: 'center', fontSize: '13px' }}>
									Mở hộp <br /> kiểm tra <br /> nhận hàng
								</Typography>
							</Stack>
							<Stack direction="column" alignItems="center" spacing={1} mx={1}>
								<img
									src={`${apiConfig.image_url}/_external_/icons/back.png`}
									alt="Return"
									style={{ width: '32px', height: '32px' }}
								/>
								<Typography sx={{ textAlign: 'center', fontSize: '13px' }}>
									Đổi trả trong <br /> <strong>7 ngày</strong> <br /> nếu sp lỗi
								</Typography>
							</Stack>
						</Wrapper>
					</IntendWrapper>
				</Stack>
			</Stack>
		</RootStyle>
	);
};

const RootStyle = styled('div')(({ theme }) => ({
	width: `calc(100% - ${PRODUCT_PAGE.IMAGE_ZOOM_WIDTH})`,
	padding: '15px',
	[theme.breakpoints.down('sm')]: {
		width: '100%',
	},
}));

const PriceWrapper = styled('div')(({ tag, theme }) => ({
	background: `${
		tag === 'sale'
			? 'linear-gradient(100deg,rgb(255, 66, 78),rgb(253, 130, 10))'
			: theme.palette.background.default
	}`,
	borderRadius: '5px',
	padding: '15px',
	marginBottom: '10px',
	color: tag === 'sale' && '#fff',
}));

const DivideLine = styled('div')({
	width: '1px',
	height: '12px',
	backgroundColor: 'rgb(199, 199, 199)',
});

const IntendWrapper = styled('div')(({ theme }) => ({
	width: BODY_INTEND.LEFT_WIDTH,
	borderRadius: '10px',
	border: `1px solid ${theme.palette.background.default}`,
}));

const Wrapper = styled('div')(({ theme }) => ({
	padding: '10px',
	'&:not(:last-child)': {
		borderBottom: `1px solid ${theme.palette.background.default}`,
	},
}));

Information.propTypes = propTypes;

export default Information;
