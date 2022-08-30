import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
	Grid,
	Stack,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableFooter,
	Button,
	Skeleton,
} from '@mui/material';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { PDFDownloadLink } from '@react-pdf/renderer';

// apis
import orderApi from '../../apis/orderApi';
// components
import Page from '../../components/Page';
import ImageLoader from '../../components/ImageLoader';
import { InvoicePDF } from '../../components/customer';
// pages
import { states, status_colors } from '../../pages/customer/Orders';
// routes
import { PATH_CUSTOMER } from '../../routes/path';
// utils
import { toVND } from '../../utils/formatMoney';
import { fDate } from '../../utils/formatDate';
import { distinguishImage } from '../../utils/formatImage';

const SkeletonLoad = (
	<Stack spacing={2}>
		<Skeleton variant="text" />
		<Skeleton variant="text" width="15%" />
		<Grid container spacing={2} sx={{ position: 'relative', right: (theme) => theme.spacing(2) }}>
			{[...Array(2)].map((_, index) => (
				<Grid key={index} item md={6} sm={6} xs={12}>
					<Stack spacing={1} sx={{ height: '100%' }}>
						<Skeleton variant="text" />
						<Skeleton variant="rectangular" height="140px" />
					</Stack>
				</Grid>
			))}
		</Grid>
		<Stack spacing={1}>
			{[...Array(2)].map((_, index) => (
				<Stack key={index} direction="row" alignItems="center" spacing={1}>
					<Skeleton variant="rectangular" width="80px" height="80px" />
					<Stack sx={{ flex: 1 }}>
						<Skeleton variant="text" />
						<Skeleton variant="text" />
						<Skeleton variant="text" />
					</Stack>
				</Stack>
			))}
		</Stack>
	</Stack>
);

const OrderDetail = () => {
	const [order, setOrder] = useState(null);
	const navigate = useNavigate();
	const { _id } = useParams();
	useEffect(() => {
		const getOrder = async () => {
			const response = await orderApi.findById(_id);
			setOrder(response);
		};
		getOrder();
	}, [_id]);

	const handleNavigateOrders = () => {
		navigate(PATH_CUSTOMER.orders);
	};
	return (
		<Page title="My Order | Tipe">
			{order && (
				<Stack spacing={2}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<Typography variant="body1">
							Order details #<strong>{order._id}</strong>
						</Typography>
						<span>-</span>
						<Typography
							variant="body1"
							color={status_colors[order.tracking_infor.status].color}
							sx={{ fontWeight: 'bold' }}
						>
							{order.tracking_infor.status_text} ({fDate(order.tracking_infor.time)})
						</Typography>
					</Stack>
					{order && order.tracking_infor.status === states.delivered && (
						<PDFDownloadLink document={<InvoicePDF order={order} />} fileName={`invoice-${order._id}`}>
							{({ loading }) =>
								loading ? (
									<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
										Invoice loading...
									</Typography>
								) : (
									<Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'rgb(27, 168, 255)' }}>
										Invoice
									</Typography>
								)
							}
						</PDFDownloadLink>
					)}
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<ArrowBackIosOutlined sx={{ cursor: 'pointer' }} onClick={handleNavigateOrders} />
						<Typography variant="caption" sx={{ fontWeight: 'bold', alignSelf: 'end' }}>
							Created at: {fDate(order.createdAt)}
						</Typography>
					</Stack>
					<Grid
						container
						spacing={2}
						columns={order.note ? 18 : 12}
						sx={{ position: 'relative', right: (theme) => theme.spacing(2) }}
					>
						<Grid item md={6} sm={6} xs={12}>
							<Stack spacing={1} sx={{ height: '100%' }}>
								<Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
									shipping address
								</Typography>
								<Wrapper>
									{order.shipping_address.company && (
										<Typography variant="body1" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
											Company: {order.shipping_address.company}
										</Typography>
									)}
									<Typography variant="body1" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
										{order.shipping_address.name}
									</Typography>
									<Typography variant="caption">
										Address:{' '}
										{`${order.shipping_address.street}, ${order.shipping_address.ward}, ${order.shipping_address.district}, ${order.shipping_address.region}`}
									</Typography>
									<Typography variant="caption">Phone number: {order.shipping_address.phone_number}</Typography>
								</Wrapper>
							</Stack>
						</Grid>
						<Grid item md={6} sm={6} xs={12}>
							<Stack spacing={1} sx={{ height: '100%' }}>
								<Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
									payment method
								</Typography>
								<Wrapper>
									<Typography variant="caption">{order.payment_method.method_text}</Typography>
									{order.payment_method.message && (
										<Typography variant="caption" sx={{ fontWeight: 'bold' }}>
											Status: {order.payment_method.message}
										</Typography>
									)}
									{order.payment_method.description && (
										<Typography variant="caption" sx={{ fontWeight: 'bold' }}>
											Description: {order.payment_method.description}
										</Typography>
									)}
								</Wrapper>
							</Stack>
						</Grid>
						{order.note && (
							<Grid item md={6} sm={6} xs={12}>
								<Stack spacing={1} sx={{ height: '100%' }}>
									<Typography variant="subtitle2" color="error.main" sx={{ textTransform: 'uppercase' }}>
										note
									</Typography>
									<Wrapper>
										<Typography variant="caption">{order.note}</Typography>
									</Wrapper>
								</Stack>
							</Grid>
						)}
					</Grid>
					<Wrapper>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell sx={{ minWidth: '150px' }}>Products</TableCell>
									<TableCell sx={{ minWidth: '130px' }}>Price</TableCell>
									<TableCell sx={{ minWidth: '80px' }}>Quantity</TableCell>
									<TableCell sx={{ minWidth: '100px' }}>Discount</TableCell>
									<TableCell align="right" sx={{ minWidth: '130px' }}>
										Guess
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{order.items.map((item) => {
									const { _id, name, images, original_price, price, quantity, slug } = item;
									return (
										<TableRow key={_id}>
											<TableCell>
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
														<Link to={`/${slug}/pid${_id}`}>
															<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
																{name}
															</Typography>
														</Link>
														<Stack direction="row" alignItems="center" spacing={1}>
															{order.tracking_infor.status === states.delivered && (
																<Button variant="outlined" size="small">
																	WRITE A REVIEW
																</Button>
															)}
															<Button variant="outlined" size="small" onClick={() => navigate(`/${slug}/pid${_id}`)}>
																REPURCHASE
															</Button>
														</Stack>
													</Stack>
												</Stack>
											</TableCell>
											<TableCell>{toVND(original_price)}</TableCell>
											<TableCell>{quantity}</TableCell>
											<TableCell>{toVND((original_price - price) * quantity)}</TableCell>
											<TableCell align="right">{toVND(price * quantity)}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
							<StyledTableFooter>
								{order.price_summary.map((price, index) => {
									const { name, value } = price;
									return (
										<tr key={index}>
											<td colSpan={4}>
												<Typography variant="subtitle2">{name}</Typography>
											</td>
											<td>
												<Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
													{toVND(value)}
												</Typography>
											</td>
										</tr>
									);
								})}
								<tr>
									<td colSpan={4}>
										<Typography variant="subtitle2">Total</Typography>
									</td>
									<td>
										<Typography color="error.main" sx={{ fontWeight: 'bold' }}>
											{toVND(order.price_summary.reduce((sum, item) => sum + item.value, 0))}
										</Typography>
									</td>
								</tr>
							</StyledTableFooter>
						</Table>
					</Wrapper>
				</Stack>
			)}
			{!order && SkeletonLoad}
		</Page>
	);
};

const Wrapper = styled(Stack)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: '4px',
	padding: theme.spacing(1),
	flex: 1,
}));

const StyledTableFooter = styled(TableFooter)({
	'& tr:first-of-type td': {
		paddingTop: '30px',
	},
	'& tr:last-of-type td': {
		paddingBottom: '30px',
	},
	'& td': {
		textAlign: 'right',
		padding: '5px 30px',
	},
});

export default OrderDetail;
