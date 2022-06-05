import { shape, string, number, arrayOf } from 'prop-types';
import { Stack, Typography, Divider, Button } from '@mui/material';

// components
import ImageLoader from '../ImageLoader';
// utils
import { toVND } from '../../utils/formatMoney';
import { fDate } from '../../utils/formatDate';
// config
import { apiConfig } from '../../config';

const STATUS_COLORS = {
	processing: {
		color: 'warning.dark',
	},
	transporting: {
		color: 'warning.darker',
	},
	delivered: {
		color: 'success.main',
	},
	cancelled: {
		color: 'error.main',
	},
};

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

const OrderPanel = ({ orders }) => {
	return (
		<Stack spacing={1}>
			{orders &&
				orders.length > 0 &&
				orders.map((order) => {
					const { _id, items, tracking_infor, price_summary } = order;
					const { status, status_text, time } = tracking_infor;
					const { color } = STATUS_COLORS[status];
					const totalPrice = price_summary.reduce((sum, price) => sum + price.value, 0);
					return (
						<Stack key={_id} p={2} spacing={1} sx={{ bgcolor: (theme) => theme.palette.background.paper }}>
							<Typography color={color} variant="subtitle2">
								{status_text} - {fDate(time)}
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
											sx={{ cursor: 'pointer' }}
										>
											<Stack direction="row" spacing={2}>
												<ImageLoader
													alt={name}
													src={`${apiConfig.image_url}/${images[0]}`}
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
									<Button variant="outlined" size="small">
										REPURCHASE
									</Button>
									<Button variant="outlined" size="small">
										DETAILS
									</Button>
								</Stack>
							</Stack>
						</Stack>
					);
				})}
			{orders && orders.length <= 0 && 'Nothing...'}
			{!orders && 'Loading...'}
		</Stack>
	);
};

OrderPanel.propTypes = propTypes;

export default OrderPanel;
