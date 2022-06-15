import { number, array, shape, string } from 'prop-types';
import { useReducer } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
	Stack,
	Typography,
	Link,
	Divider,
	Button,
	Alert,
	Backdrop,
	CircularProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';

// apis
import orderApi from '../../apis/orderApi';
import paymentApi from '../../apis/paymentApi';
// components
import { PaypalButtonsWrapper } from '../../components/_external_/paypal';
import { paymentKeys } from '../../components/checkout/PaymentMethod';
// hooks
import useModal from '../../hooks/useModal';
// pages
import { states } from '../../pages/customer/Orders';
// redux
import { removeSelected } from '../../redux/slices/cart';
// routes
import { PATH_CHECKOUT, PATH_CUSTOMER } from '../../routes/path';
// utils
import { toVND } from '../../utils/formatMoney';
import enqueueSnackbar from '../../utils/snackbar';
// constant
import { HEADER_HEIGHT, CART_PAGE } from '../../constant';

const initialState = {
	isLoading: false,
};

const handlers = {
	START_LOADING: (state) => {
		return {
			...state,
			isLoading: true,
		};
	},
};

const reducer = (state, action) =>
	handlers[action.type] ? handlers[action.type](state, action) : state;

const propTypes = {
	selectedItems: array,
	selectedCount: number,
	paymentMethod: shape({
		key: string,
		label: string,
	}),
};

const TotalPrice = ({ selectedItems, selectedCount, paymentMethod }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { addresses } = useSelector((state) => state.account);
	const address = addresses.length > 0 ? addresses.filter((address) => address.is_default)[0] : null;
	const dispatchSlice = useDispatch();
	const navigate = useNavigate();
	const confirm = useConfirm();
	const { pathname } = useLocation();
	const { openModal, keys } = useModal();
	const isInCart = pathname.includes('cart');
	const priceSummary = [
		{
			name: 'Guess',
			value: selectedItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
			sign: 1, // sign -1 (negative) or 1 (positive)
		},
	];
	const totalPrice = priceSummary.reduce((sum, item) => sum + item.value * item.sign, 0);

	const handleOpenAppPromotion = () => {
		openModal(keys.appPromotion);
	};
	const handleNavigateCheckout = () => {
		if (selectedCount < 1) {
			enqueueSnackbar('You have not selected any products to buy yet', {
				anchorOrigin: {
					vertical: 'bottom',
					horizontal: 'center',
				},
				preventDuplicate: true,
			});
			return;
		}
		const linkTo = address ? PATH_CHECKOUT.payment : PATH_CHECKOUT.shipping;
		navigate(linkTo);
	};
	const handleValidateOrder = async () => {
		if (selectedCount < 1) {
			enqueueSnackbar('You have not selected any products to order yet', {
				anchorOrigin: {
					vertical: 'bottom',
					horizontal: 'center',
				},
				preventDuplicate: true,
			});
			return false;
		}
		if (!paymentMethod.key) {
			enqueueSnackbar('You have not selected any payment method', {
				anchorOrigin: {
					vertical: 'bottom',
					horizontal: 'center',
				},
				preventDuplicate: true,
			});
			return false;
		}
		await confirm({
			title: 'Order',
			content: (
				<Alert severity="info">Have you checked the product information for sure before order?</Alert>
			),
		});
		return true;
	};
	const handleOrder = async (willValidate = true, payment = null) => {
		try {
			const permission = willValidate ? await handleValidateOrder() : true;
			if (!permission) return;

			const { region, district, ward, is_default, ...other } = address;
			const { key, label } = paymentMethod;
			const items = selectedItems.map((item) => ({ ...item.product, quantity: item.quantity }));
			const price_summary = priceSummary.map((price) => {
				const { name, value, sign } = price;
				return value > 0 && { name, value: value * sign };
			});

			const orderData = {
				shipping_address: {
					region: region.name,
					district: district.name,
					ward: ward.name,
					...other,
				},
				payment_method: {
					method_key: key,
					method_text: label,
					message: payment?.message || '',
					description: payment?.description || '',
				},
				items,
				price_summary,
			};
			// set up await payment until get response from payment gateways api
			// otherwise, processcing for order has been paid
			const tracking_infor = {
				status: payment?.paid ? states.processing : states.awaiting_payment,
				status_text: payment?.paid ? 'Pending processing' : 'Awaiting payment',
			};
			if (key !== paymentKeys.cash) orderData['tracking_infor'] = tracking_infor;

			dispatch({ type: 'START_LOADING' });
			const response = await orderApi.insert(orderData);
			const { msg, _id, orderedItems } = response;
			dispatchSlice(removeSelected(orderedItems));

			switch (key) {
				case paymentKeys.momo:
					{
						const payUrl = await paymentApi.momoCreate({
							_id,
							phone_number: address.phone_number,
							amount: price_summary.reduce((sum, price) => sum + price.value, 0),
							redirectUrl: `${window.location.origin}${PATH_CUSTOMER.orders}`,
						});
						window.location.href = payUrl;
					}
					break;
				case paymentKeys.vnpay:
					{
						const payUrl = await paymentApi.vnpayCreate({
							_id,
							phone_number: address.phone_number,
							amount: price_summary.reduce((sum, price) => sum + price.value, 0),
							redirectUrl: `${window.location.origin}${PATH_CUSTOMER.orders}`,
						});
						window.location.href = payUrl;
					}
					break;
				default:
					navigate(PATH_CHECKOUT.result, {
						state: {
							statusCode: 200,
							msg,
						},
					});
					break;
			}
		} catch (error) {
			if (error === undefined) return;
			const { status, statusText } = error.response;
			navigate(PATH_CHECKOUT.result, {
				state: {
					statusCode: status,
					msg: statusText,
				},
			});
		}
	};
	return (
		<RootStyle>
			<ContentInner in_cart={isInCart ? 1 : 0}>
				{address && (
					<Wrapper>
						<Stack direction="row" justifyContent="space-between" alignItems="center">
							<Typography variant="subtitle2">Ship Address</Typography>
							<Linking
								component={RouterLink}
								to={`${PATH_CHECKOUT.shipping}${isInCart ? '?isIntendedCart=1' : ''}`}
							>
								Change
							</Linking>
						</Stack>
						<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
							{address.name} | {address.phone_number}
						</Typography>
						<Typography variant="body2">{`${address.street}, ${address.ward.name}, ${address.district.name}, ${address.region.name}`}</Typography>
					</Wrapper>
				)}
				<Wrapper>
					<Typography variant="subtitle2">Tipe Promotion</Typography>
					<Typography
						variant="subtitle2"
						onClick={handleOpenAppPromotion}
						sx={{ fontWeight: 'bold', color: 'rgb(26 139 237)', cursor: 'pointer' }}
					>
						<i className="bi bi-ticket-detailed"></i> Select or enter another Promotion
					</Typography>
				</Wrapper>
				<Wrapper>
					{priceSummary.map((price, index) => {
						const { name, value, sign } = price;
						return (
							(value > 0 || name === priceSummary[0].name) && (
								<Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
									<Typography variant="subtitle2">{name}</Typography>
									<Typography variant="subtitle1">{toVND(value * sign)}</Typography>
								</Stack>
							)
						);
					})}
					<Divider />
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="subtitle2">Total</Typography>
						<Stack alignItems="end">
							<Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'error.main' }}>
								{selectedCount > 0 ? toVND(totalPrice) : 'Choose a product, please!'}
							</Typography>
							<Typography variant="caption">(VAT includes)</Typography>
						</Stack>
					</Stack>
				</Wrapper>
				{isInCart && (
					<Button
						variant="contained"
						color="error"
						disableElevation
						onClick={handleNavigateCheckout}
						sx={{ width: '100%' }}
					>
						Check out ({selectedCount})
					</Button>
				)}
				{!isInCart &&
					(paymentMethod.key !== paymentKeys.international ? (
						<Button
							variant="contained"
							color="error"
							disableElevation
							onClick={() => handleOrder()}
							sx={{ width: '100%' }}
						>
							Order ({selectedCount})
						</Button>
					) : (
						<PaypalButtonsWrapper
							address={address}
							selectedItems={selectedItems}
							priceSummary={priceSummary}
							handleOrder={handleOrder}
						/>
					))}
			</ContentInner>
			<Backdrop open={state.isLoading}>
				<CircularProgress sx={{ color: '#fff' }} />
			</Backdrop>
		</RootStyle>
	);
};

const RootStyle = styled('div')(({ theme }) => ({
	width: `calc(100% - calc(${CART_PAGE.CART_LIST_WIDTH} + 15px))`,
	[theme.breakpoints.down('md')]: {
		width: '100%',
	},
}));

const ContentInner = styled('div')(({ in_cart }) => ({
	position: in_cart ? 'sticky' : '',
	top: `calc(${HEADER_HEIGHT} + 10px)`,
}));

const Wrapper = styled('div')(({ theme }) => ({
	padding: '10px',
	marginBottom: '10px',
	backgroundColor: theme.palette.background.paper,
	fontSize: '14px',
}));

const Linking = styled(Link)({
	color: 'rgb(26 139 237)',
	cursor: 'pointer',
	textDecoration: 'none',
	fontWeight: '500',
});

TotalPrice.propTypes = propTypes;

export default TotalPrice;
