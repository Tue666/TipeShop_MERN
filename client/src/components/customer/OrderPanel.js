import { shape, string, number, arrayOf } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography, Divider, Button, Skeleton } from '@mui/material';

// apis
import paymentApi from '../../apis/paymentApi';
// components
import ImageLoader from '../ImageLoader';
import { paymentKeys } from '../checkout/PaymentMethod';
// hooks
import useModal from '../../hooks/useModal';
// page
import { states, status_colors } from '../../pages/customer/Orders';
// routes
import { PATH_CUSTOMER } from '../../routes/path';
// utils
import { toVND } from '../../utils/formatMoney';
import { fDate } from '../../utils/formatDate';
import { distinguishImage } from '../../utils/formatImage';
// config
import { appConfig } from '../../config';

const propTypes = {
	orders: arrayOf(
		shape({
			_id: string,
			items: arrayOf(
				shape({
					_id: string,
					name: string,
					quantity: number,
					price: number,
					images: arrayOf(string),
				})
			),
			tracking_infor: shape({
				status: string,
				status_text: string,
				time: string,
			}),
			price_summary: arrayOf(
				shape({
					name: string,
					value: number,
				})
			),
		})
	),
};

const SkeletonLoad = (
	<Stack p={2} spacing={1} sx={{ bgcolor: (theme) => theme.palette.background.paper }}>
		<Skeleton variant="text" />
		<Divider />
		<Stack direction="row" justifyContent="space-between" spacing={1} p={1}>
			<Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
				<Skeleton variant="rectangular" width={80} height={80} />
				<Stack sx={{ width: '100%' }}>
					<Skeleton variant="text" />
					<Skeleton variant="text" width="20%" />
					<Skeleton variant="text" width="15%" />
				</Stack>
			</Stack>
			<Stack alignItems="end" sx={{ width: '100px' }}>
				<Skeleton variant="text" width="90%" />
			</Stack>
		</Stack>
		<Divider />
		<Stack alignItems="end" spacing={1}>
			<Skeleton variant="text" width="15%" />
			<Skeleton variant="text" width="15%" />
		</Stack>
	</Stack>
);

const EmptyLoad = (
	<Stack
		p={10}
		justifyContent="center"
		alignItems="center"
		spacing={1}
		sx={{ bgcolor: (theme) => theme.palette.background.paper }}
	>
		<img
			alt="empty-order"
			src={`${appConfig.public_image_url}/empty-order.png`}
			style={{
				width: '200px',
				height: '200px',
			}}
		/>
		<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
			No orders yet
		</Typography>
	</Stack>
);

const OrderPanel = ({ orders }) => {
	const navigate = useNavigate();
	const { openModal, keys } = useModal();

	const handleContinuePaying = async (order) => {
		const { _id, payment_method, price_summary, shipping_address } = order;
		switch (payment_method.method_key) {
			case paymentKeys.momo:
				{
					const payUrl = await paymentApi.momoCreate({
						_id,
						phone_number: shipping_address.phone_number,
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
						phone_number: shipping_address.phone_number,
						amount: price_summary.reduce((sum, price) => sum + price.value, 0),
						redirectUrl: `${window.location.origin}${PATH_CUSTOMER.orders}`,
					});
					window.location.href = payUrl;
				}
				break;
			default:
				break;
		}
	};
	const handleCancelOrder = (_id) => {
		openModal(keys.cancelOrder, { _id });
	};
	const handleNavigate = (_id) => {
		navigate(`${PATH_CUSTOMER.orderDetail}/${_id}`);
	};
	return (
		<Stack spacing={1}>
			{orders &&
				orders.length > 0 &&
				orders.map((order) => {
					const { _id, items, tracking_infor, price_summary } = order;
					const { status, status_text, time } = tracking_infor;
					const { color, icon } = status_colors[status];
					const totalPrice = price_summary.reduce((sum, price) => sum + price.value, 0);
					return (
						<Stack key={_id} p={2} spacing={1} sx={{ bgcolor: (theme) => theme.palette.background.paper }}>
							<Typography color={color} variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
								{icon}&nbsp;{status_text} - #{_id} ({fDate(time)})
							</Typography>
							<Divider />
							<Stack>
								{items.map((item) => {
									const { _id, name, quantity, price, images } = item;
									return (
										<Stack
											key={_id}
											direction="row"
											justifyContent="space-between"
											spacing={1}
											p={1}
											onClick={() => handleNavigate(order._id)}
											sx={{ cursor: 'pointer' }}
										>
											<Stack direction="row" spacing={2}>
												<ImageLoader
													alt={name}
													src={distinguishImage(images[0])}
													sx={{
														width: '80px',
														height: '80px',
														border: '0.5px solid rgb(238, 238, 238)',
														flexShrink: 0,
														padding: '5px',
													}}
												/>
												<Stack>
													<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
														{name}
													</Typography>
													<Typography variant="caption">Single: {toVND(price)}</Typography>
													<Typography variant="caption">Quantity: {quantity}</Typography>
												</Stack>
											</Stack>
											<Stack alignItems="end" sx={{ width: '100px' }}>
												<Typography variant="subtitle2">{toVND(quantity * price)}</Typography>
											</Stack>
										</Stack>
									);
								})}
							</Stack>
							<Divider />
							<Stack alignItems="end" spacing={1}>
								<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
									Total price: {toVND(totalPrice)}
								</Typography>
								<Stack direction="row" alignItems="center" spacing={1}>
									{status === states.awaiting_payment && (
										<Button variant="outlined" color="success" size="small" onClick={() => handleContinuePaying(order)}>
											CONTINUE PAYING
										</Button>
									)}
									{status === states.processing && (
										<Button variant="outlined" color="error" size="small" onClick={() => handleCancelOrder(order._id)}>
											CANCEL
										</Button>
									)}
									<Button variant="outlined" size="small" onClick={() => handleNavigate(order._id)}>
										DETAILS
									</Button>
								</Stack>
							</Stack>
						</Stack>
					);
				})}
			{orders && orders.length <= 0 && EmptyLoad}
			{!orders && SkeletonLoad}
		</Stack>
	);
};

OrderPanel.propTypes = propTypes;

export default OrderPanel;
