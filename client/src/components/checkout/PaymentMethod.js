import { string } from 'prop-types';
import { styled } from '@mui/material/styles';
import {
	Stack,
	Box,
	Typography,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
} from '@mui/material';
import { useDispatch } from 'react-redux';

// redux
import { changePaymentMethod } from '../../redux/slices/cart';
// config
import { appConfig } from '../../config';

const PAYMENT_METHOD = [
	{
		value: 'cash',
		icon:
			'https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-cod.svg',
		label: 'Cash payment upon receipt',
		render: (label) => <Typography variant="subtitle2">{label}</Typography>,
	},
	{
		value: 'momo',
		icon:
			'https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-momo.svg',
		label: 'Pay with Momo wallet',
		render: (label) => <Typography variant="subtitle2">{label}</Typography>,
	},
	{
		value: 'vnpay',
		icon:
			'https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-vnpay.png',
		label: 'Pay by VNPAY',
		render: (label) => <Typography variant="subtitle2">{label}</Typography>,
	},
	{
		value: 'international',
		icon:
			'https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-credit.svg',
		label: 'Payment by international card Visa, Credit Card, Paypal',
		render: (label) => (
			<div>
				<Typography variant="subtitle2">{label}</Typography>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Box
						component="img"
						alt="visa"
						src={`${appConfig.public_icon_url}/visa.png`}
						sx={{ width: '24px', height: '24px' }}
					/>
					<Box
						component="img"
						alt="credit"
						src={`${appConfig.public_icon_url}/credit.png`}
						sx={{ width: '18px', height: '18px' }}
					/>
					<Box
						component="img"
						alt="paypal"
						src={`${appConfig.public_icon_url}/paypal.png`}
						sx={{ width: '18px', height: '18px' }}
					/>
				</Stack>
			</div>
		),
	},
];

export const paymentKeys = PAYMENT_METHOD.reduce(
	(keys, method) => ({ ...keys, [method.value]: method.value }),
	{}
);

const propTypes = {
	paymentKey: string,
};

const PaymentMethod = ({ paymentKey }) => {
	const dispatch = useDispatch();

	const handleChangePaymentMethod = (e) => {
		const key = e.target.value;
		const label = PAYMENT_METHOD.find((method) => method.value === key).label;
		dispatch(
			changePaymentMethod({
				key,
				label,
			})
		);
	};
	return (
		<Wrapper spacing={1}>
			<Typography variant="subtitle2">Payment method</Typography>
			<FormControl>
				<RadioGroup value={paymentKey} onChange={handleChangePaymentMethod}>
					{PAYMENT_METHOD.map((method) => {
						const { value, icon, label, render } = method;
						return (
							<FormControlLabel
								key={value}
								value={value}
								control={<Radio size="small" />}
								label={
									<Stack direction="row" alignItems="center" spacing={1}>
										<Box
											component="img"
											alt={value}
											src={icon}
											sx={{
												width: '32px',
												height: '32px',
											}}
										/>
										{render(label)}
									</Stack>
								}
							/>
						);
					})}
				</RadioGroup>
			</FormControl>
		</Wrapper>
	);
};

const Wrapper = styled(Stack)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: '5px',
	padding: '15px',
}));

PaymentMethod.propTypes = propTypes;

export default PaymentMethod;
